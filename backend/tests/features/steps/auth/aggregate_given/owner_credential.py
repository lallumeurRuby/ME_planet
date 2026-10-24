from behave import given

from app.core.security import hash_password
from app.models.owner_credential import OwnerCredential
from app.repositories.owner_credential_repository import OwnerCredentialRepository
from helpers.values import parse_time

OWNER_CREDENTIAL_ID = 1


@given("擁有者憑證為：")
def step_given_owner_credential(context):
    row = context.table[0]
    repository = OwnerCredentialRepository(context.db_session)
    repository.save(
        OwnerCredential(
            id=OWNER_CREDENTIAL_ID,
            password_hash=hash_password(row["password"]),
            failed_attempts=int(row["failed_attempts"]),
            locked_until=parse_time(row["locked_until"]),
        )
    )
    context.memo["owner_password"] = row["password"]
