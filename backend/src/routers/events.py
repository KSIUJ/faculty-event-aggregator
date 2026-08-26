import hashlib

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from calendar_feed import build_calendar
from database import get_db
from schemas import (
    CreateEvent,
    EventListResponse,
    EventResponse,
    UpdateEvent,
)
from services import event_service
from services.exceptions import RelatedResourceNotFoundError, ServiceValidationError

router = APIRouter(
    prefix="/events", 
    tags=["Events"],
)


# GET /events
@router.get("", response_model=list[EventListResponse])                                                                           
def read_events(
    event_category: int | None = Query(default=None, description="Filter events by Event Category ID"),                                                   
    topic_category: int | None = Query(default=None, description="Filter events by Topic Category ID"),
    db: Session = Depends(get_db)
):
    return event_service.get_all_events(
        db,
        event_category_id=event_category,
        topic_category_id=topic_category
    )


def _calendar_response(content: str, filename: str) -> Response:
    etag = hashlib.sha256(content.encode("utf-8")).hexdigest()
    return Response(
        content=content,
        media_type="text/calendar; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "Content-Disposition": f'inline; filename="{filename}"',
            "ETag": f'"{etag}"',
        },
    )


# GET /events/calendar.ics
@router.get("/calendar.ics", response_class=Response)
def read_events_calendar(db: Session = Depends(get_db)):
    events = event_service.get_all_events(db)
    return _calendar_response(
        build_calendar(events),
        "wydzial-wydarzenia.ics",
    )


# GET /events/{id}/calendar.ics
@router.get("/{event_id}/calendar.ics", response_class=Response)
def read_event_calendar(event_id: int, db: Session = Depends(get_db)):
    event = event_service.get_event_by_id(db, event_id)

    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    return _calendar_response(
        build_calendar([event], name=event.title),
        f"wydarzenie-{event.id}.ics",
    )

# GET /events/{id}
@router.get("/{event_id}", response_model=EventResponse)
def read_event(event_id: int, db: Session = Depends(get_db)):
    event = event_service.get_event_by_id(db, event_id)

    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    return event


# POST /events
@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def add_event(payload: CreateEvent, db: Session = Depends(get_db)):
    try:
        return event_service.create_event(db, payload)
    except RelatedResourceNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except ServiceValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(exc),
        ) from exc


# PATCH /events/{id}
@router.patch("/{event_id}", response_model=EventResponse)
def modify_event(event_id: int, payload: UpdateEvent, db: Session = Depends(get_db)):
    try:
        updated_event = event_service.update_event(
            db,
            event_id,
            payload,
        )
    except RelatedResourceNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except ServiceValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(exc),
        ) from exc

    if updated_event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    return updated_event


# DELETE /events/{id}
@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_event(event_id: int, db: Session = Depends(get_db)):
    deleted = event_service.delete_event(db, event_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    return None
