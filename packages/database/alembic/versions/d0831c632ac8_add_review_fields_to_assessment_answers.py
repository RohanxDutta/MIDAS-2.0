"""Add review_status and reviewer_remarks to assessment_answers

Revision ID: d0831c632ac8
Revises: b4e71a9c3d21
Create Date: 2026-07-21 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'd0831c632ac8'
down_revision: Union[str, None] = 'b4e71a9c3d21'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('assessment_answers', sa.Column('review_status', sa.String(), nullable=True))
    op.add_column('assessment_answers', sa.Column('reviewer_remarks', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('assessment_answers', 'reviewer_remarks')
    op.drop_column('assessment_answers', 'review_status')
