"""Data Table 值的表示慣例（見 系統抽象.md、auth/句型.md、paragraph/句型.md）。

| 表示式          | 意義                         |
|-----------------|------------------------------|
| null            | None                         |
| ""              | 空字串                       |
| $名稱.id        | context.ids["名稱"]          |
| now / now±N[smhd] | 相對於測試執行時刻的時間   |
| 2026-01-01 00:00 | UTC 絕對時間                |
"""

import re
from datetime import datetime, timedelta, timezone

TIME_TOLERANCE = timedelta(seconds=5)

_ID_REF = re.compile(r"^\$(.+)\.id$")
_RELATIVE_TIME = re.compile(r"^now(?:([+-])(\d+)([smhd]))?$")
_UNITS = {"s": "seconds", "m": "minutes", "h": "hours", "d": "days"}


def parse_value(context, raw: str):
    """解析一般欄位：null / "" / $x.id / 原字串。"""
    raw = raw.strip()
    if raw == "null":
        return None
    if raw == '""':
        return ""
    match = _ID_REF.match(raw)
    if match:
        return resolve_id(context, raw)
    return raw


def resolve_id(context, raw: str) -> int:
    """解析 id：`$名稱.id` 取自 context.ids，否則視為整數字面值（如 99999）。"""
    raw = raw.strip()
    match = _ID_REF.match(raw)
    if not match:
        return int(raw)
    name = match.group(1)
    if name not in context.ids:
        raise KeyError(f"找不到 '{name}' 的 ID，請先在 Given 建立")
    return context.ids[name]


def parse_time(raw: str) -> datetime | None:
    raw = raw.strip()
    if raw == "null":
        return None
    match = _RELATIVE_TIME.match(raw)
    if match:
        sign, amount, unit = match.groups()
        now = datetime.now(timezone.utc)
        if not sign:
            return now
        delta = timedelta(**{_UNITS[unit]: int(amount)})
        return now + delta if sign == "+" else now - delta
    return datetime.strptime(raw, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)


def assert_time_matches(actual: datetime | None, expected_raw: str, field: str) -> None:
    expected = parse_time(expected_raw)
    if expected is None:
        assert actual is None, f"{field} 預期為 null，實際 {actual}"
        return
    assert actual is not None, f"{field} 預期為 {expected_raw}，實際為 null"
    if actual.tzinfo is None:
        actual = actual.replace(tzinfo=timezone.utc)
    assert (
        abs(actual - expected) <= TIME_TOLERANCE
    ), f"{field} 預期約為 {expected.isoformat()}（{expected_raw}），實際 {actual.isoformat()}"
