from mock_data.event_categories import EVENT_CATEGORIES


def get_all_event_categories():
    return EVENT_CATEGORIES


def get_event_category_by_id(event_category_id: int):
    return next(
        (
            event_category
            for event_category in EVENT_CATEGORIES
            if event_category["id"] == event_category_id
        ),
        None,
    )
