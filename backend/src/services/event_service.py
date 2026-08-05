from mock_data.events import EVENTS


def get_all_events():
    return EVENTS


def get_event_by_id(event_id: int):
    return next(
        (event for event in EVENTS if event["id"] == event_id),
        None,
    )