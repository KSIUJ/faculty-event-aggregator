from mock_data.topic_categories import TOPIC_CATEGORIES


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
