from fastapi import APIRouter, HTTPException

from schemas import EventResponse
from services.event_service import (
    get_all_events,
    get_event_by_id,
)

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=list[EventResponse])
def read_events():
    return get_all_events()


@router.get("/{event_id}", response_model=EventResponse)
def read_event(event_id: int):
    event = get_event_by_id(event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found",
        )

    return event