from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas import (
    CreateTopicCategory,
    TopicCategoryResponse,
    UpdateTopicCategory,
)
from services import topic_category_service

router = APIRouter(
    prefix="/topic-categories",
    tags=["Topic categories"],
)


# GET /topic-categories
@router.get("", response_model=list[TopicCategoryResponse])
def read_topic_categories(db: Session = Depends(get_db)):
    return topic_category_service.get_all_topic_categories(db)


# GET /topic-categories/{id}
@router.get("/{topic_category_id}", response_model=TopicCategoryResponse)
def read_topic_category(topic_category_id: int, db: Session = Depends(get_db)):
    topic_category = topic_category_service.get_topic_category_by_id(
        db,
        topic_category_id,
    )

    if topic_category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic category not found",
        )

    return topic_category


# POST /topic-categories
@router.post("", response_model=TopicCategoryResponse, status_code=status.HTTP_201_CREATED)
def add_topic_category(payload: CreateTopicCategory, db: Session = Depends(get_db)):
    return topic_category_service.create_topic_category(db, payload)


# PATCH /topic-categories/{id}
@router.patch("/{topic_category_id}", response_model=TopicCategoryResponse)
def modify_topic_category(topic_category_id: int, payload: UpdateTopicCategory, db: Session = Depends(get_db)):
    updated_category = topic_category_service.update_topic_category(
        db,
        topic_category_id,
        payload,
    )

    if updated_category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic category not found",
        )

    return updated_category


# DELETE /topic-categories/{id}
@router.delete("/{topic_category_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_topic_category(topic_category_id: int, db: Session = Depends(get_db)):
    deleted = topic_category_service.delete_topic_category(
        db,
        topic_category_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic category not found",
        )

    return None