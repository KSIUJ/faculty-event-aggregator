from fastapi import APIRouter, HTTPException

from schemas import EventCategoryResponse
from services.event_category_service import (
    get_all_event_categories,
    get_event_category_by_id,
)

router = APIRouter(prefix="/event-categories", tags=["Event categories"])


@router.get("", response_model=list[EventCategoryResponse])
def read_event_categories():
    return get_all_event_categories()


@router.get("/{event_category_id}", response_model=EventCategoryResponse)
def read_event_category(event_category_id: int):
    event_category = get_event_category_by_id(event_category_id)

    if event_category is None:
        raise HTTPException(
            status_code=404,
            detail="Event category not found",
        )

    return event_category
