from fastapi import APIRouter, HTTPException

from schemas import TopicCategoryResponse
from services.topic_category_service import (
    get_all_topic_categories,
    get_topic_category_by_id,
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
