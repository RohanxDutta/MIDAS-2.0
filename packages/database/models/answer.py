from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

class AssessmentAnswer(SQLModel, table=True):
    __tablename__ = "assessment_answers"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    assessment_id: UUID = Field(foreign_key="assessments.id", index=True)

    # Section B - Domain Details
    domain_id: int = Field(nullable=False) # 1 to 15
    score: int = Field(nullable=False)     # 0 to 4 (representing selected choice)
    factual_description: str = Field(nullable=False) # Supporting description textbox

    # Relationships
    assessment: "Assessment" = Relationship(back_populates="answers")
