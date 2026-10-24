from behave import given

from app.core.security import hash_password
from app.models.owner_credential import OwnerCredential
from app.repositories.owner_credential_repository import OwnerCredentialRepository
from helpers.api import api_path

DEFAULT_OWNER_PASSWORD = "Orbit#2026"


@given("擁有者已登入")
def step_given_owner_logged_in(context):
    repository = OwnerCredentialRepository(context.db_session)
    if repository.get() is None:
        repository.save(
            OwnerCredential(
                id=1,
                password_hash=hash_password(DEFAULT_OWNER_PASSWORD),
                failed_attempts=0,
                locked_until=None,
            )
        )
    response = context.api_client.post(
        api_path("/auth/login"), json={"password": DEFAULT_OWNER_PASSWORD}
    )
    assert response.status_code == 200, f"前置登入失敗：{response.status_code} {response.text}"
    context.memo["jwt"] = response.json()["token"]
