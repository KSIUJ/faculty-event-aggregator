from sqlalchemy import select
from sqlalchemy.orm import Session

from models import EventCategory
from schemas import CreateEventCategory, UpdateEventCategory
from database import commit, commit_and_refresh


# GET /event-categories
def get_all_event_categories(db: Session) -> list[EventCategory]:
    statement = select(EventCategory).order_by(EventCategory.id)
    return list(db.scalars(statement).all())


# GET /event-categories/{id}
def get_event_category_by_id(db: Session, event_category_id: int) -> EventCategory | None:
    return db.get(EventCategory, event_category_id)


# POST /event-categories
def create_event_category(db: Session, payload: CreateEventCategory) -> EventCategory:
    event_category = EventCategory(**payload.model_dump())
    db.add(event_category)
    return commit_and_refresh(db, event_category)


# PATCH /event-categories/{id}
def update_event_category(db: Session, event_category_id: int, payload: UpdateEventCategory) -> EventCategory | None:
    event_category = db.get(EventCategory, event_category_id)

    if event_category is None:
        return None

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(event_category, field, value)

    return commit_and_refresh(db, event_category)


# DELETE /event-categories/{id}
def delete_event_category(db: Session, event_category_id: int) -> bool:
    event_category = db.get(EventCategory, event_category_id)

    if event_category is None:
        return False

    db.delete(event_category)
    commit(db)
    return True