"""Make assessment_id nullable in AssessmentFile

Revision ID: b4e71a9c3d21
Revises: 0a29c7e5edae
Create Date: 2026-07-19 13:48:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b4e71a9c3d21'
down_revision: Union[str, None] = '0a29c7e5edae'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop not-null constraint on assessment_id column in assessment_files table
    op.alter_column('assessment_files', 'assessment_id', existing_type=sa.Uuid(), nullable=True)


def downgrade() -> None:
    # Re-enable not-null constraint on assessment_id column in assessment_files table
    op.alter_column('assessment_files', 'assessment_id', existing_type=sa.Uuid(), nullable=False)
