from mock_data.topic_categories import TOPIC_CATEGORIES
from schemas import CreateTopicCategory, UpdateTopicCategory

def get_all_topic_categories():
    return TOPIC_CATEGORIES


def get_topic_category_by_id(topic_category_id: int):
    return next(
        (
            topic_category
            for topic_category in TOPIC_CATEGORIES
            if topic_category["id"] == topic_category_id
        ),
        None,
    )

def create_topic_category(topic_category: CreateTopicCategory):
    new_id = max(c["id"] for c in TOPIC_CATEGORIES) + 1 if TOPIC_CATEGORIES else 1

    new_topic_category = {
        "id": new_id,
        "title": topic_category.title,
        "icon_name": topic_category.icon_name,
    }
    TOPIC_CATEGORIES.append(new_topic_category)
    return new_topic_category

def update_topic_category(topic_category_id: int, topic_category:  UpdateTopicCategory):
    existing_topic_category = next(
        (c for c in TOPIC_CATEGORIES if c["id"] == topic_category_id), None
    )
    if not existing_topic_category:
        return None

    if topic_category.title is not None:
        existing_topic_category["title"] = topic_category.title
    
    if topic_category.icon_name is not None:
        existing_topic_category["icon_name"] = topic_category.icon_name

    return existing_topic_category

def delete_topic_category(topic_category_id: int):
    existing_topic_category = next(
        (c for c in TOPIC_CATEGORIES if c["id"] == topic_category_id), None
    )
    if not existing_topic_category:
        return False
    
    TOPIC_CATEGORIES.remove(existing_topic_category)
    return True