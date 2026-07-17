import os
import requests
from datetime import date
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlmodel import Session, select
from pydantic import BaseModel, Field as PydanticField

# Shared Database Models
from models.assessment import Assessment
from models.answer import AssessmentAnswer
from models.file import AssessmentFile

# Security & Utilities
from core.db import get_session
from core.redis import redis_drafts
from core.security import get_current_user_id
from core.config import settings

router = APIRouter(prefix="/api/v1")

# --- PYDANTIC SCHEMAS FOR VALIDATION ---

class AnswerInput(BaseModel):
    domain_id: int # 1 to 15
    score: int     # 0 to 4
    factual_description: str

class SubmitInput(BaseModel):
    # Section A
    dataset_title: str
    version_doi_handle: str
    submitting_pi_custodian: str
    date_of_assessment: date
    assessor_name_affiliation: str

    # Section B
    answers: List[AnswerInput]
    domain_11_na: bool = False # If applicable toggle for Domain 11

    # Section C
    identification_risk: int # 0, 5, 15, 30, 50
    sensitivity_multiplier: float # 1.0, 1.5, 2.0

    # Section D
    dataset_type: str # "structured" or "unstructured"
    dataset_link: Optional[str] = None # Link if unstructured
    uploaded_file_ids: Optional[List[UUID]] = [] # File IDs if structured

class UploadUrlInput(BaseModel):
    file_name: str
    file_size: int

# --- API ENDPOINTS ---

@router.post("/draft")
def save_draft(payload: Dict[str, Any], user_id: str = Depends(get_current_user_id)):
    """Saves the current draft form input data to Redis, keyed by user_id."""
    success = redis_drafts.save_draft(user_id, payload)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save draft to cache server"
        )
    return {"status": "success", "message": "Draft saved"}


@router.get("/draft")
def get_draft(user_id: str = Depends(get_current_user_id)):
    """Retrieves the user's active draft form input from Redis."""
    draft = redis_drafts.get_draft(user_id)
    if not draft:
        return {}
    return draft


@router.post("/upload-url")
def get_presigned_url(payload: UploadUrlInput, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_session)):
    """Generates a Supabase Storage presigned URL for direct client PUT upload."""
    if not payload.file_name.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    if payload.file_size <= 0:
        raise HTTPException(status_code=400, detail="File cannot be empty.")

    # Unique path structure in the bucket: evidence/user_id/uuid/file_name
    file_uuid = uuid4()
    storage_path = f"evidence/{user_id}/{file_uuid}/{payload.file_name}"
    
    # Request Supabase Storage REST API for a presigned PUT URL
    supabase_storage_url = f"{settings.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/upload/sign/private/{storage_path}"
    headers = {
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        # Generates a PUT signature with a 15-minute expiry
        response = requests.post(
            supabase_storage_url,
            json={"expiresIn": 900},
            headers=headers
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Supabase Storage signature error: {response.text}")
            
        data = response.json()
        upload_url = data.get("url")
        if not upload_url:
            raise HTTPException(status_code=500, detail="Supabase Storage failed to return an upload URL.")
            
        # Create a pending file record in our database
        db_file = AssessmentFile(
            id=file_uuid,
            assessment_id=UUID(int=0), # Placeholder, linked during final form submit
            file_name=payload.file_name,
            storage_path=storage_path,
            file_size=payload.file_size,
            status="pending"
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)

        # Build absolute URL if Supabase returns relative API paths
        if upload_url.startswith("/"):
            upload_url = f"{settings.NEXT_PUBLIC_SUPABASE_URL}{upload_url}"

        return {
            "file_id": db_file.id,
            "upload_url": upload_url,
            "storage_path": storage_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating presigned URL: {str(e)}")


@router.post("/webhooks/storage")
def handle_storage_webhook(payload: Dict[str, Any], db: Session = Depends(get_session)):
    """Supabase DB trigger webhook firing on insert to storage.objects.
    Validates CSV file constraints asynchronously.
    """
    # Extract file metadata
    record = payload.get("record", {})
    bucket_id = record.get("bucket_id")
    name = record.get("name") # e.g. "evidence/user_id/uuid/data.csv"
    metadata = record.get("metadata", {})
    file_size = metadata.get("size", 0)

    # 1. Bucket and path filters
    if bucket_id != "private" or not name.startswith("evidence/"):
        return {"status": "ignored", "reason": "non-evidence bucket or directory"}

    # Extract the file UUID from the path
    # Path format: "evidence/user_id/file_uuid/file_name"
    path_parts = name.split("/")
    if len(path_parts) < 4:
         return {"status": "error", "reason": "invalid path structure"}
    
    file_uuid_str = path_parts[2]
    try:
        file_uuid = UUID(file_uuid_str)
    except ValueError:
        return {"status": "error", "reason": "invalid file UUID in storage path"}

    # Fetch the corresponding file record from DB
    db_file = db.exec(select(AssessmentFile).where(AssessmentFile.id == file_uuid)).first()
    if not db_file:
        return {"status": "error", "reason": f"File record with ID {file_uuid} not found"}

    # 2. Validation constraints: 1) Verify .csv extension, 2) Verify size is > 0
    is_csv = name.lower().endswith(".csv")
    is_not_empty = file_size > 0

    if is_csv and is_not_empty:
        db_file.status = "success"
    else:
        db_file.status = "failed"

    db.add(db_file)
    db.commit()
    return {"status": "completed", "file_id": file_uuid, "validation": db_file.status}


@router.post("/submit")
def submit_assessment(payload: SubmitInput, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_session)):
    """Calculates Quality and Privacy indices, saves submission permanently to PostgreSQL, and clears draft."""
    
    # 1. Validate domain scores size
    if len(payload.answers) < (14 if payload.domain_11_na else 15):
         raise HTTPException(status_code=400, detail="Incomplete domain responses.")

    # 2. Compute CQI-Lite Score
    total_score = 0
    max_score = 56 if payload.domain_11_na else 60

    for ans in payload.answers:
        if payload.domain_11_na and ans.domain_id == 11:
            continue # Exclude Domain 11 score if marked N/A
        total_score += ans.score

    cqi_score = (total_score / max_score) * 100
    
    # Determine CQI Grade
    if cqi_score >= 95:
        cqi_grade = "Diamond"
    elif cqi_score >= 85:
        cqi_grade = "Platinum"
    elif cqi_score >= 70:
        cqi_grade = "Gold"
    elif cqi_score >= 50:
        cqi_grade = "Silver"
    elif cqi_score >= 25:
        cqi_grade = "Bronze"
    else:
        cqi_grade = "Remediation"

    # 3. Compute PRS-Lite Score
    prs_score = round(payload.identification_risk * payload.sensitivity_multiplier)
    prs_score = min(prs_score, 100) # Cap at 100

    # Determine PRS Risk Band
    if prs_score <= 15:
        prs_band = "Low"
    elif prs_score <= 40:
        prs_band = "Moderate"
    elif prs_score <= 70:
        prs_band = "High"
    else:
        prs_band = "Very High"

    # 4. Compute Release Category (Matrix lookup)
    # Row: PRS Band (Low, Moderate, High, Very High)
    # Column: CQI Grade (Diamond, Platinum, Gold, Silver, Bronze, Remediation)
    release_category = "Restricted" # Safe default
    
    if prs_band == "Low":
        if cqi_grade == "Diamond":
            release_category = "Open"
        elif cqi_grade == "Platinum":
            release_category = "Open/Controlled"
        elif cqi_grade == "Gold":
            release_category = "Controlled/Open"
        elif cqi_grade == "Silver":
            release_category = "Controlled"
        else: # Bronze or Remediation
            release_category = "Restricted"
            
    elif prs_band == "Moderate":
        if cqi_grade == "Diamond":
            release_category = "Open/Controlled"
        elif cqi_grade in ["Platinum", "Gold"]:
            release_category = "Controlled"
        else:
            release_category = "Restricted"
            
    elif prs_band == "High":
        if cqi_grade in ["Diamond", "Platinum"]:
            release_category = "Controlled"
        else:
            release_category = "Restricted"
            
    elif prs_band == "Very High":
        release_category = "Restricted"

    # 5. Save main Assessment details
    db_assessment = Assessment(
        user_id=UUID(user_id),
        dataset_title=payload.dataset_title,
        version_doi_handle=payload.version_doi_handle,
        submitting_pi_custodian=payload.submitting_pi_custodian,
        date_of_assessment=payload.date_of_assessment,
        assessor_name_affiliation=payload.assessor_name_affiliation,
        cqi_lite_score=cqi_score,
        cqi_lite_grade=cqi_grade,
        prs_lite_score=prs_score,
        prs_lite_risk_band=prs_band,
        release_category=release_category,
        dataset_type=payload.dataset_type,
        dataset_link=payload.dataset_link if payload.dataset_type == "unstructured" else None,
        status="submitted"
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)

    # 6. Save domain answers
    for ans in payload.answers:
        db_answer = AssessmentAnswer(
            assessment_id=db_assessment.id,
            domain_id=ans.domain_id,
            score=ans.score,
            factual_description=ans.factual_description
        )
        db.add(db_answer)

    # 7. Relink and validate uploaded structured CSV files
    if payload.dataset_type == "structured" and payload.uploaded_file_ids:
        for file_id in payload.uploaded_file_ids:
            db_file = db.exec(select(AssessmentFile).where(AssessmentFile.id == file_id)).first()
            if db_file:
                db_file.assessment_id = db_assessment.id
                db.add(db_file)

    db.commit()

    # 8. Clear Redis Draft Cache
    redis_drafts.clear_draft(user_id)

    return {
        "status": "success",
        "assessment_id": db_assessment.id,
        "cqi_grade": cqi_grade,
        "prs_band": prs_band,
        "release_category": release_category
    }
