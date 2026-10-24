"""create paragraphs

Revision ID: 0004
Revises: 0003
Create Date: 2026-10-24
"""

import sqlalchemy as sa

from alembic import op

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "paragraphs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "sub_satellite_id",
            sa.Integer(),
            sa.ForeignKey("sub_satellites.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("title", sa.String(100), nullable=False),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )


def downgrade() -> None:
    op.drop_table("paragraphs")
