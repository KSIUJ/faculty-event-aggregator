from fastapi import APIRouter, HTTPException

from schemas import TopicCategoryResponse, CreateTopicCategory, UpdateTopicCategory
from services.topic_category_service import (
    get_all_topic_categories,
    get_topic_category_by_id,
    create_topic_category,
    update_topic_category,
    delete_topic_category
)

router = APIRouter(prefix="/topic-categories", tags=["Topic categories"])


@router.get("", response_model=list[TopicCategoryResponse])
def read_topic_categories():
    return get_all_topic_categories()


@router.get("/{topic_category_id}", response_model=TopicCategoryResponse)
def read_topic_category(topic_category_id: int):
    topic_category = get_topic_category_by_id(topic_category_id)

    if topic_category is None:
        raise HTTPException(
            status_code=404,
            detail="Topic category not found",
        )

    return topic_category
@router.post("", response_model=TopicCategoryResponse, status_code=201)
def add_topic_category(topic_category: CreateTopicCategory):
    return create_topic_category(topic_category)

@router.patch("/{topic_category_id}", response_model=TopicCategoryResponse )
def modify_topic_category(topic_category_id: int, topic_category: UpdateTopicCategory):
    updated_topic_category = update_topic_category(topic_category_id,topic_category)
    if not updated_topic_category:
        raise HTTPException(status_code=404, detail="Topic category not found")
    return updated_topic_category

@router.delete("/{topic_category_id}",status_code=204)
def remove_topic_category(topic_category_id: int):
    success = delete_topic_category(topic_category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Topic category not found")
    return None