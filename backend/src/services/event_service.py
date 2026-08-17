from mock_data.events import EVENTS
from datetime import datetime, timezone
from schemas import CreateEvent, UpdateEvent

def get_all_events():
    return EVENTS


def get_event_by_id(event_id: int):
    return next(
        (event for event in EVENTS if event["id"] == event_id),
        None,
    )

def create_event(event: CreateEvent):
    new_id = max(e["id"] for e in EVENTS) + 1 if EVENTS else 1

    new_event = {
        "id": new_id,
        "title": event.title,
        "location": event.location,
        "start_time": event.start_time.isoformat(),
        "end_time": event.end_time.isoformat() if event.end_time else None,
        "event_category_id": event.event_category_id,
        "organizer_id": event.organizer_id,
        "topic_category_ids": event.topic_category_ids,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    EVENTS.append(new_event)
    return new_event
def update_event(event_id: int, event: UpdateEvent):
    existing_event = next(
        (c for c in EVENTS if c["id"] == event_id), None
    )
    if not existing_event:
        return None

    if event.title is not None:
        existing_event["title"] = event.title
    if event.location is not None:
        existing_event["location"] = event.location


    if event.start_time is not None:
        existing_event["start_time"] = event.start_time.isoformat()
    if event.end_time is not None:
        existing_event["end_time"] = event.end_time.isoformat()

    if event.event_category_id is not None:
        existing_event["event_category_id"] = event.event_category_id
    if event.organizer_id is not None:
        existing_event["organizer_id"] = event.organizer_id

    if event.topic_category_ids is not None:
        existing_event["topic_category_ids"] = event.topic_category_ids
    
    return existing_event

    
def delete_event(event_id: int):
    existing_event = next(
        (e for e in EVENTS if e["id"] == event_id), None
    )
    if not existing_event:
        return False

    EVENTS.remove(existing_event)
    return True