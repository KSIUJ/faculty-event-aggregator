from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas import (
    CreateOrganizer,
    OrganizerResponse,
    UpdateOrganizer,
)
from services import organizer_service

router = APIRouter(
    prefix="/organizers", 
    tags=["Organizers"],
)


# GET /organizers
@router.get("", response_model=list[OrganizerResponse])
def read_organizers(db: Session = Depends(get_db)):
    return organizer_service.get_all_organizers(db)


# GET /organizers/{id}
@router.get("/{organizer_id}", response_model=OrganizerResponse)
def read_organizer(organizer_id: int, db: Session = Depends(get_db)):
    organizer = organizer_service.get_organizer_by_id(
        db,
        organizer_id,
    )

    if organizer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer not found",
        )

    return organizer


# POST /organizers
@router.post("", response_model=OrganizerResponse, status_code=status.HTTP_201_CREATED)
def add_organizer(payload: CreateOrganizer, db: Session = Depends(get_db)):
    return organizer_service.create_organizer(db, payload)


# PATCH /organizers/{id}
@router.patch("/{organizer_id}", response_model=OrganizerResponse)
def modify_organizer(organizer_id: int, payload: UpdateOrganizer, db: Session = Depends(get_db)):
    updated_organizer = organizer_service.update_organizer(
        db,
        organizer_id,
        payload,
    )

    if updated_organizer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer not found",
        )

    return updated_organizer


# DELETE /organizers/{id}
@router.delete("/{organizer_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_organizer(organizer_id: int, db: Session = Depends(get_db)):
    deleted = organizer_service.delete_organizer(
        db,
        organizer_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer not found",
        )

    return None