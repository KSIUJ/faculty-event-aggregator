from mock_data.event_categories import EVENT_CATEGORIES
from schemas import UpdateEventCategory, CreateEventCategory

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

def create_event_category(event_category: CreateEventCategory):
    new_id = max(c["id"] for c in EVENT_CATEGORIES) + 1 if EVENT_CATEGORIES else 1

    new_event_category = {
        "id": new_id,
        "title": event_category.title,
        "icon_name": event_category.icon_name,
    }
    EVENT_CATEGORIES.append(new_event_category)
    return new_event_category

def update_event_category(event_category_id: int, event_category: UpdateEventCategory):
    existing_event_category = next(
        (c for c in EVENT_CATEGORIES if c["id"] == event_category_id), None
    )
    if not existing_event_category:
        return None

    if event_category.title is not None:
        existing_event_category["title"] = event_category.title
        
    if event_category.icon_name is not None:
        existing_event_category["icon_name"] = event_category.icon_name


    return existing_event_category

def delete_event_category(event_category_id: int):
    existing_event_category = next(
        (c for c in EVENT_CATEGORIES if c["id"] == event_category_id), None
    )
    if not existing_event_category:
        return False

    EVENT_CATEGORIES.remove(existing_event_category)
    return True