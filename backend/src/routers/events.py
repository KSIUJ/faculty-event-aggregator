from fastapi import APIRouter, HTTPException

from schemas import (
    EventListResponse,
    EventResponse,
    CreateEvent,  
    UpdateEvent   
)
from services.event_service import (
    get_all_events,
    get_event_by_id,
    create_event, 
    update_event, 
    delete_event  
)
router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=list[EventListResponse])
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

@router.post("", response_model=EventResponse, status_code=201)
def create_event_response(event: CreateEvent):
    return create_event(event)

@router.patch("/{event_id}", response_model=EventResponse )
def modify_event(event_id: int, event: UpdateEvent): 
    updated_event = update_event(event_id, event)
    if not updated_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated_event

@router.delete("/{event_id}",status_code=204)
def remove_event(event_id: int):
    success = delete_event(event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return None