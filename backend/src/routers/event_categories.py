from fastapi import APIRouter, HTTPException

from schemas import (
    EventCategoryResponse,
    CreateEventCategory,
    UpdateEventCategory
)

from services.event_category_service import (
    get_all_event_categories,
    get_event_category_by_id,
    create_event_category,
    update_event_category,
    delete_event_category
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

@router.post("", response_model=EventCategoryResponse, status_code=201)
def add_event_category(category: CreateEventCategory):
    return create_event_category(category)

@router.patch("/{event_category_id}", response_model=EventCategoryResponse )
def modify_event_category(event_category_id: int, category: UpdateEventCategory):
    updated_category = update_event_category(event_category_id, category)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Event category not found")
    return updated_category
@router.delete("/{event_category_id}",status_code=204)
def remove_event_category(event_category_id: int):
    success = delete_event_category(event_category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event category not found")
    return None

