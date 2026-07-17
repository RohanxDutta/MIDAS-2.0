from datetime import date, datetime
from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

class Assessment(SQLModel, table=True):
    __tablename__ = "assessments"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(nullable=False) # References Supabase Auth User ID

    # Section A - Basic Info
    dataset_title: str = Field(index=True)
    version_doi_handle: str
    submitting_pi_custodian: str
    date_of_assessment: date
    assessor_name_affiliation: str

    # Auto-Calculated Metrics
    cqi_lite_score: Optional[float] = Field(default=None)
    cqi_lite_grade: Optional[str] = Field(default=None)
    prs_lite_score: Optional[float] = Field(default=None)
    prs_lite_risk_band: Optional[str] = Field(default=None)
    release_category: Optional[str] = Field(default=None)

    # Section D - Dataset Details
    dataset_type: str = Field(default="structured") # "structured" or "unstructured"
    dataset_link: Optional[str] = Field(default=None) # Used for unstructured URL

    # Status & Audit
    status: str = Field(default="draft") # "draft" or "submitted"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    answers: List["AssessmentAnswer"] = Relationship(back_populates="assessment", cascade_delete=True)
    files: List["AssessmentFile"] = Relationship(back_populates="assessment", cascade_delete=True)
