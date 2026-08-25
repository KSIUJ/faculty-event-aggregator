import json

from sqlalchemy import select

from config import settings
from models import Event, EventCategory, Organizer, TopicCategory
from schemas import (
    EventCategoryResponse,
    EventResponse,
    OrganizerResponse,
    TopicCategoryResponse,
)
from seed import seed_database_from_sample_data


def test_sample_data_matches_api_response_schemas():
    sample_data = json.loads(settings.SAMPLE_DATA_PATH.read_text(encoding="utf-8"))

    for organizer in sample_data["organizers"]:
        OrganizerResponse.model_validate(organizer)
    for topic_category in sample_data["topic_categories"]:
        TopicCategoryResponse.model_validate(topic_category)
    for event_category in sample_data["event_categories"]:
        EventCategoryResponse.model_validate(event_category)
    for event in sample_data["events"]:
        EventResponse.model_validate(event)


def test_seed_populates_an_empty_database(db_session):
    assert seed_database_from_sample_data(db_session) is True

    assert len(db_session.scalars(select(Organizer)).all()) == 3
    assert len(db_session.scalars(select(TopicCategory)).all()) == 3
    assert len(db_session.scalars(select(EventCategory)).all()) == 5
    assert set(db_session.scalars(select(EventCategory.title)).all()) == {
        "Lecture",
        "Workshop",
        "Networking",
        "Conference",
        "Seminar",
    }

    events = list(db_session.scalars(select(Event).order_by(Event.id)).all())
    assert len(events) == 3
    assert events[0].title == "Wprowadzenie do sieci neuronowych: od teorii do praktyki"
    assert [topic.title for topic in events[0].topic_categories] == ["Sztuczna inteligencja"]


def test_seed_does_not_restore_deleted_events(db_session):
    seed_database_from_sample_data(db_session)

    for event in db_session.scalars(select(Event)).all():
        db_session.delete(event)
    db_session.commit()

    assert seed_database_from_sample_data(db_session) is False
    assert list(db_session.scalars(select(Event)).all()) == []


def test_seed_preserves_existing_records_and_adds_sample_data(db_session):
    existing_organizer = Organizer(name="Istniejący organizator", type="ORGANIZATION")
    db_session.add(existing_organizer)
    db_session.commit()

    assert seed_database_from_sample_data(db_session) is True

    organizer_names = set(db_session.scalars(select(Organizer.name)).all())
    assert "Istniejący organizator" in organizer_names
    assert "Koło Naukowe Robotyki" in organizer_names
    assert len(db_session.scalars(select(Event)).all()) == 3
