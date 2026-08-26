import json
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from config import settings
from models import Event, EventCategory, Organizer, SeedHistory, TopicCategory


SAMPLE_DATA_SEED_KEY = "docs/sampledata.json:v1"


def _parse_datetime(value: str | None) -> datetime | None:
    if value is None:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _resource_data(source: dict) -> dict:
    data = {key: value for key, value in source.items() if key != "id"}
    if "created_at" in data:
        data["created_at"] = _parse_datetime(data["created_at"])
    return data


def seed_database_from_sample_data(db: Session) -> bool:
    """Import docs/sampledata.json once without restoring later deletions."""
    if db.get(SeedHistory, SAMPLE_DATA_SEED_KEY) is not None:
        return False

    sample_data = json.loads(settings.SAMPLE_DATA_PATH.read_text(encoding="utf-8"))

    try:
        organizer_ids: dict[int, int] = {}
        for source in sample_data["organizers"]:
            source_id = int(source["id"])
            organizer = db.scalar(select(Organizer).where(Organizer.name == source["name"]))
            if organizer is None:
                organizer = Organizer(**_resource_data(source))
                db.add(organizer)
                db.flush()
            organizer_ids[source_id] = organizer.id

        topic_category_ids: dict[int, int] = {}
        for source in sample_data["topic_categories"]:
            source_id = int(source["id"])
            topic_category = db.scalar(select(TopicCategory).where(TopicCategory.title == source["title"]))
            if topic_category is None:
                topic_category = TopicCategory(**_resource_data(source))
                db.add(topic_category)
                db.flush()
            topic_category_ids[source_id] = topic_category.id

        event_category_ids: dict[int, int] = {}
        for source in sample_data["event_categories"]:
            source_id = int(source["id"])
            event_category = db.scalar(select(EventCategory).where(EventCategory.title == source["title"]))
            if event_category is None:
                event_category = EventCategory(**_resource_data(source))
                db.add(event_category)
                db.flush()
            event_category_ids[source_id] = event_category.id

        for source in sample_data["events"]:
            event_data = {
                key: value
                for key, value in source.items()
                if key not in {"id", "event_category", "organizer", "topic_categories"}
            }
            source_topic_ids = [topic["id"] for topic in source["topic_categories"]]
            event_data["organizer_id"] = organizer_ids[int(source["organizer"]["id"])]
            event_data["event_category_id"] = event_category_ids[
                int(source["event_category"]["id"])
            ]
            event_data["start_time"] = _parse_datetime(event_data["start_time"])
            event_data["end_time"] = _parse_datetime(event_data.get("end_time"))
            event_data["created_at"] = _parse_datetime(event_data["created_at"])

            event = db.scalar(
                select(Event).where(
                    Event.title == event_data["title"],
                    Event.start_time == event_data["start_time"],
                )
            )
            if event is None:
                event = Event(**event_data)
                event.topic_categories = [
                    db.get(TopicCategory, topic_category_ids[int(source_topic_id)])
                    for source_topic_id in source_topic_ids
                ]
                db.add(event)

        db.add(SeedHistory(key=SAMPLE_DATA_SEED_KEY))

        db.commit()
    except Exception:
        db.rollback()
        raise

    return True
