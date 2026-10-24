from datetime import datetime

from behave import then

from helpers.values import parse_time, parse_value, resolve_id

_ID_FIELDS = ("id", "satellite_id", "sub_satellite_id")
_TIME_FIELDS = ("created_at", "updated_at")


def _expected(context, field: str, raw: str):
    if field in _ID_FIELDS:
        return resolve_id(context, raw)
    if field in _TIME_FIELDS:
        return parse_time(raw)
    return parse_value(context, raw)


def _actual(field: str, value):
    if field in _TIME_FIELDS and value is not None:
        return datetime.fromisoformat(value)
    return value


@then("查詢結果應依序為：")
def step_then_query_result_in_order(context):
    """只比對表頭列出的欄位；列的順序即預期排序。"""
    data = context.last_response.json()
    assert isinstance(data, list), f"預期回傳陣列，實際 {data}"
    rows = list(context.table)
    assert len(data) == len(rows), f"預期 {len(rows)} 筆，實際 {len(data)} 筆：{data}"
    for index, (item, row) in enumerate(zip(data, rows), start=1):
        for field in row.headings:
            expected = _expected(context, field, row[field])
            actual = _actual(field, item.get(field))
            assert actual == expected, f"第 {index} 筆的 {field} 預期 {expected!r}，實際 {actual!r}"
