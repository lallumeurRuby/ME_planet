"""create sub_satellites

Revision ID: 0003
Revises: 0002
Create Date: 2026-10-24
"""

import sqlalchemy as sa

from alembic import op

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "sub_satellites",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "satellite_id",
            sa.Integer(),
            sa.ForeignKey("satellites.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("satellite_id", "name"),
    )


def downgrade() -> None:
    op.drop_table("sub_satellites")
