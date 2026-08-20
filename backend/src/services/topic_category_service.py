from sqlalchemy import select
from sqlalchemy.orm import Session

from models import TopicCategory
from schemas import CreateTopicCategory, UpdateTopicCategory
from database import commit, commit_and_refresh


# GET /topic-categories
def get_all_topic_categories(db: Session) -> list[TopicCategory]:
    statement = select(TopicCategory).order_by(TopicCategory.id)
    return list(db.scalars(statement).all())


# GET /topic-categories/{id}
def get_topic_category_by_id(db: Session, topic_category_id: int) -> TopicCategory | None:
    return db.get(TopicCategory, topic_category_id)


# POST /topic-categories
def create_topic_category(db: Session, payload: CreateTopicCategory) -> TopicCategory:
    topic_category = TopicCategory(**payload.model_dump())
    db.add(topic_category)
    return commit_and_refresh(db, topic_category)


# PATCH /topic-categories/{id}
def update_topic_category(db: Session, topic_category_id: int, payload: UpdateTopicCategory) -> TopicCategory | None:
    topic_category = db.get(TopicCategory, topic_category_id)

    if topic_category is None:
        return None

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(topic_category, field, value)

    return commit_and_refresh(db, topic_category)


# DELETE /topic-categories/{id}
def delete_topic_category(db: Session, topic_category_id: int) -> bool:
    topic_category = db.get(TopicCategory, topic_category_id)

    if topic_category is None:
        return False

    db.delete(topic_category)
    commit(db)
    return True