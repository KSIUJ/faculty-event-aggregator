from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas import (
    CreateEventCategory,
    EventCategoryResponse,
    UpdateEventCategory,
)
from services import event_category_service

router = APIRouter(
    prefix="/event-categories",
    tags=["Event categories"],
)


# GET /event-categories
@router.get("", response_model=list[EventCategoryResponse])
def read_event_categories(db: Session = Depends(get_db)):
    return event_category_service.get_all_event_categories(db)


# GET /event-categories/{id}
@router.get("/{event_category_id}", response_model=EventCategoryResponse)
def read_event_category(event_category_id: int, db: Session = Depends(get_db)):
    event_category = event_category_service.get_event_category_by_id(db, event_category_id)

    if event_category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event category not found",
        )

    return event_category


# POST /event-categories
@router.post("", response_model=EventCategoryResponse, status_code=status.HTTP_201_CREATED)
def add_event_category(payload: CreateEventCategory, db: Session = Depends(get_db)):
    return event_category_service.create_event_category(db, payload)


# PATCH /event-categories/{id}
@router.patch("/{event_category_id}", response_model=EventCategoryResponse)
def modify_event_category(event_category_id: int, payload: UpdateEventCategory, db: Session = Depends(get_db)):
    updated_category = event_category_service.update_event_category(
        db,
        event_category_id,
        payload,
    )

    if updated_category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event category not found",
        )

    return updated_category


# DELETE /event-categories/{id}
@router.delete("/{event_category_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_event_category(event_category_id: int, db: Session = Depends(get_db)):
    deleted = event_category_service.delete_event_category(
        db,
        event_category_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event category not found",
        )

    return None
