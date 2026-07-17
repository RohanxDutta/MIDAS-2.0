from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

class AssessmentFile(SQLModel, table=True):
    __tablename__ = "assessment_files"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    assessment_id: UUID = Field(foreign_key="assessments.id", index=True)

    # Section D - File Metadata
    file_name: str = Field(nullable=False)
    storage_path: str = Field(nullable=False) # Path in Supabase Storage Bucket
    file_size: int = Field(nullable=False)      # Size in bytes
    status: str = Field(default="pending")      # "pending", "success", "failed"

    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    assessment: "Assessment" = Relationship(back_populates="files")
