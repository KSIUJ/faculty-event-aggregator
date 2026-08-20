from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload

from database import commit, commit_and_refresh
from models import Event, EventCategory, Organizer, TopicCategory
from schemas import CreateEvent, UpdateEvent
from services.exceptions import RelatedResourceNotFoundError, ServiceValidationError

EVENT_RELATIONSHIPS = (
    joinedload(Event.event_category),
    joinedload(Event.organizer),
    selectinload(Event.topic_categories) if hasattr(Event, "topic_categories") else joinedload(Event.topic_category),
)


# Utility functions
def _normalize_datetime(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def _validate_event_times(
    start_time: datetime | None,
    end_time: datetime | None,
) -> None:
    st = _normalize_datetime(start_time)
    et = _normalize_datetime(end_time)
    if st is not None and et is not None and et < st:
        raise ServiceValidationError("end_time cannot be earlier than start_time.")


def _validate_relations(
    db: Session,
    event_category_id: int | None = None,
    organizer_id: int | None = None,
    topic_category_ids: list[int] | None = None,
) -> tuple[EventCategory | None, Organizer | None, list[TopicCategory]]:
    event_category = None
    if event_category_id is not None:
        event_category = db.get(EventCategory, event_category_id)
        if event_category is None:
            raise RelatedResourceNotFoundError(
                f"EventCategory with id {event_category_id} not found."
            )

    organizer = None
    if organizer_id is not None:
        organizer = db.get(Organizer, organizer_id)
        if organizer is None:
            raise RelatedResourceNotFoundError(
                f"Organizer with id {organizer_id} not found."
            )

    topic_categories: list[TopicCategory] = []
    if topic_category_ids:
        statement = select(TopicCategory).where(TopicCategory.id.in_(topic_category_ids))
        topic_categories = list(db.scalars(statement).all())
        found_ids = {tc.id for tc in topic_categories}
        missing_ids = set(topic_category_ids) - found_ids
        if missing_ids:
            raise RelatedResourceNotFoundError(
                f"TopicCategory with ids {sorted(missing_ids)} not found."
            )

    return event_category, organizer, topic_categories


# GET /events
def get_all_events(
        db: Session,
        event_category_id: int | None = None,
        topic_category_id: int | None = None
    ) -> list[Event]:

    statement = select(Event).options(*EVENT_RELATIONSHIPS).order_by(Event.id)
    
    if event_category_id is not None:                                                                                             
        statement = statement.where(
            Event.event_category_id == event_category_id
        )                                                 
                                                                                                                                                                                      
    if topic_category_id is not None:                                                                                             
         statement = statement.where(                                                                                              
            Event.topic_categories.any(TopicCategory.id == topic_category_id) 
         )

    return list(db.scalars(statement).all())


# GET /events/{id}
def get_event_by_id(db: Session, event_id: int) -> Event | None:
    statement = (
        select(Event)
        .where(Event.id == event_id)
        .options(*EVENT_RELATIONSHIPS)
    )
    return db.scalars(statement).first()


# POST /events
def create_event(db: Session, payload: CreateEvent) -> Event:
    _validate_event_times(payload.start_time, payload.end_time)
    _, _, topic_categories = _validate_relations(
        db,
        event_category_id=payload.event_category_id,
        organizer_id=payload.organizer_id,
        topic_category_ids=payload.topic_category_ids,
    )

    data = payload.model_dump(exclude={"topic_category_ids"})
    if "created_at" not in data or data.get("created_at") is None:
        data["created_at"] = datetime.now(timezone.utc)

    event = Event(**data)
    if hasattr(event, "topic_categories"):
        event.topic_categories = topic_categories
    elif hasattr(event, "topic_category_id") and payload.topic_category_ids:
        event.topic_category_id = payload.topic_category_ids[0]

    db.add(event)
    commit(db)
    return get_event_by_id(db, event.id)


# PATCH /events/{id}
def update_event(db: Session, event_id: int, payload: UpdateEvent) -> Event | None:
    event = get_event_by_id(db, event_id)
    if event is None:
        return None

    update_data = payload.model_dump(exclude_unset=True)

    new_start = update_data.get("start_time", event.start_time)
    new_end = update_data.get("end_time", event.end_time)
    _validate_event_times(new_start, new_end)

    event_category_id = update_data.get("event_category_id")
    organizer_id = update_data.get("organizer_id")
    topic_category_ids = update_data.get("topic_category_ids")

    _, _, topic_categories = _validate_relations(
        db,
        event_category_id=event_category_id,
        organizer_id=organizer_id,
        topic_category_ids=topic_category_ids,
    )

    if "topic_category_ids" in update_data:
        del update_data["topic_category_ids"]
        if hasattr(event, "topic_categories"):
            event.topic_categories = topic_categories
        elif hasattr(event, "topic_category_id") and topic_category_ids:
            event.topic_category_id = topic_category_ids[0]

    for field, value in update_data.items():
        setattr(event, field, value)

    commit(db)
    return get_event_by_id(db, event_id)


# DELETE /events/{id}
def delete_event(db: Session, event_id: int) -> bool:
    event = db.get(Event, event_id)

    if event is None:
        return False

    db.delete(event)
    commit(db)
    return True