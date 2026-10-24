from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.owner_credential import OwnerCredential


class OwnerCredentialRepository:
    def __init__(self, session: Session):
        self.session = session

    def get(self) -> OwnerCredential | None:
        return self.session.scalars(select(OwnerCredential).limit(1)).first()

    def save(self, credential: OwnerCredential) -> OwnerCredential:
        merged = self.session.merge(credential)
        self.session.commit()
        return merged
