from behave import then

from app.repositories.owner_credential_repository import OwnerCredentialRepository
from helpers.values import assert_time_matches


@then("擁有者憑證應為：")
def step_then_owner_credential(context):
    row = context.table[0]
    context.db_session.expire_all()
    credential = OwnerCredentialRepository(context.db_session).get()
    assert credential is not None, "系統中沒有擁有者憑證"
    expected_attempts = int(row["failed_attempts"])
    assert (
        credential.failed_attempts == expected_attempts
    ), f"failed_attempts 預期 {expected_attempts}，實際 {credential.failed_attempts}"
    assert_time_matches(credential.locked_until, row["locked_until"], "locked_until")
