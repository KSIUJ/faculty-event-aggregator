from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Organizer
from schemas import CreateOrganizer, UpdateOrganizer
from database import commit, commit_and_refresh


# GET /organizers
def get_all_organizers(db: Session) -> list[Organizer]:
    statement = select(Organizer).order_by(Organizer.id)
    return list(db.scalars(statement).all())


# GET /organizers/{id}
def get_organizer_by_id(db: Session, organizer_id: int) -> Organizer | None:
    return db.get(Organizer, organizer_id)


# POST /organizers
def create_organizer(db: Session, payload: CreateOrganizer) -> Organizer:
    organizer = Organizer(**payload.model_dump())
    db.add(organizer)
    return commit_and_refresh(db, organizer)


# PATCH /organizers/{id}
def update_organizer(db: Session, organizer_id: int, payload: UpdateOrganizer) -> Organizer | None:
    organizer = db.get(Organizer, organizer_id)

    if organizer is None:
        return None

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(organizer, field, value)

    return commit_and_refresh(db, organizer)


# DELETE /organizers/{id}
def delete_organizer(db: Session, organizer_id: int) -> bool:
    organizer = db.get(Organizer, organizer_id)

    if organizer is None:
        return False

    db.delete(organizer)
    commit(db)
    return True