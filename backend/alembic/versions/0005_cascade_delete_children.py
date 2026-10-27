"""cascade delete children

刪除 Satellite 連帶刪除 SubSatellite 與 Paragraph；刪除 SubSatellite 連帶刪除 Paragraph。

Revision ID: 0005
Revises: 0004
Create Date: 2026-10-27
"""

from alembic import op

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def _replace_fk(table: str, column: str, ref_table: str, ondelete: str) -> None:
    name = f"{table}_{column}_fkey"
    op.drop_constraint(name, table, type_="foreignkey")
    op.create_foreign_key(name, table, ref_table, [column], ["id"], ondelete=ondelete)


def upgrade() -> None:
    _replace_fk("sub_satellites", "satellite_id", "satellites", "CASCADE")
    _replace_fk("paragraphs", "sub_satellite_id", "sub_satellites", "CASCADE")


def downgrade() -> None:
    _replace_fk("paragraphs", "sub_satellite_id", "sub_satellites", "RESTRICT")
    _replace_fk("sub_satellites", "satellite_id", "satellites", "RESTRICT")
