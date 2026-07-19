from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

class AssessmentFile(SQLModel, table=True):
    __tablename__ = "assessment_files"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True) # Ownership tracking for security
    assessment_id: Optional[UUID] = Field(default=None, foreign_key="assessments.id", nullable=True, index=True)

    # Section D - File Metadata
    file_name: str = Field(nullable=False)
    storage_path: str = Field(nullable=False) # Path in Supabase Storage Bucket
    file_size: int = Field(nullable=False)      # Size in bytes
    status: str = Field(default="pending")      # "pending", "success", "failed"

    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    assessment: Optional["Assessment"] = Relationship(back_populates="files")
