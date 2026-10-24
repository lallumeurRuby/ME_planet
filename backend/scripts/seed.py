"""本機資料初始化。

    設定擁有者密碼（必要，否則無法登入後台）：
        .venv/bin/python -m scripts.seed --owner-password            # 互動輸入，不留在 shell 歷史
    同時灌入示範資料（與前端 MSW fixtures 相同，取自 feature 的 Given）：
        .venv/bin/python -m scripts.seed --owner-password --demo

資料庫位置讀取 DATABASE_URL（預設 localhost:5433/me_planet_api_dev）。
"""

import argparse
import getpass
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.deps import get_session_factory
from app.core.security import hash_password
from app.models.owner_credential import OwnerCredential
from app.models.paragraph import Paragraph
from app.models.satellite import Satellite
from app.models.sub_satellite import SubSatellite

OWNER_CREDENTIAL_ID = 1


def at(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)


DEMO_SATELLITES = [
    ("天文", "2026-01-01 00:00"),
    ("程式設計", "2026-01-02 00:00"),
    ("音樂", "2026-01-03 00:00"),
]
DEMO_SUB_SATELLITES = [
    ("天文", "星系", "2026-02-01 00:00"),
    ("天文", "行星", "2026-02-02 00:00"),
    ("天文", "彗星", "2026-02-03 00:00"),
    ("天文", "黑洞", "2026-02-03 00:00"),
    ("程式設計", "演算法", "2026-02-01 00:00"),
]
DEMO_PARAGRAPHS = [
    ("星系", "銀河系簡介", "我們所在的星系", "<p>銀河系是一個棒旋星系。</p>", "2026-03-01 00:00"),
    ("星系", "麥哲倫雲", None, "<p>麥哲倫雲是矮星系。</p>", "2026-03-02 00:00"),
    ("星系", "太陽系簡介", None, "<p>太陽系有八大行星。</p>", "2026-03-02 12:00"),
    ("星系", "仙女座星系", "距離最近的大星系", "<p>仙女座星系是螺旋星系。</p>", "2026-03-03 00:00"),
    ("行星", "火星筆記", "紅色星球", "<p>火星有兩顆衛星。</p>", "2026-03-04 00:00"),
]


def set_owner_password(password: str) -> None:
    with get_session_factory()() as session:
        session.merge(
            OwnerCredential(
                id=OWNER_CREDENTIAL_ID,
                password_hash=hash_password(password),
                failed_attempts=0,
                locked_until=None,
            )
        )
        session.commit()
    print("已設定擁有者密碼（錯誤次數與鎖定已重置）")


def seed_demo() -> None:
    with get_session_factory()() as session:
        if session.scalars(select(Satellite).limit(1)).first():
            print("已有衛星資料，略過示範資料")
            return
        satellites = {name: Satellite(name=name, created_at=at(t)) for name, t in DEMO_SATELLITES}
        session.add_all(satellites.values())
        session.flush()
        subs = {
            name: SubSatellite(satellite_id=satellites[sat].id, name=name, created_at=at(t))
            for sat, name, t in DEMO_SUB_SATELLITES
        }
        session.add_all(subs.values())
        session.flush()
        session.add_all(
            Paragraph(
                sub_satellite_id=subs[sub].id,
                title=title,
                summary=summary,
                content=content,
                created_at=at(t),
                updated_at=at(t),
            )
            for sub, title, summary, content, t in DEMO_PARAGRAPHS
        )
        session.commit()
    print(
        f"已灌入示範資料：{len(DEMO_SATELLITES)} 衛星、{len(DEMO_SUB_SATELLITES)} 子衛星、{len(DEMO_PARAGRAPHS)} 段落"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="ME Planet 本機資料初始化")
    parser.add_argument("--owner-password", action="store_true", help="互動輸入並設定擁有者密碼")
    parser.add_argument("--demo", action="store_true", help="灌入示範資料（資料庫沒有衛星時）")
    args = parser.parse_args()
    if not (args.owner_password or args.demo):
        parser.error("請至少指定 --owner-password 或 --demo")
    if args.owner_password:
        password = getpass.getpass("擁有者密碼：")
        if not password or password != getpass.getpass("再輸入一次："):
            raise SystemExit("兩次輸入不一致或為空，未變更")
        set_owner_password(password)
    if args.demo:
        seed_demo()


if __name__ == "__main__":
    main()
