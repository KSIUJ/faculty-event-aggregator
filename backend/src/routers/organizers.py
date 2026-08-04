from fastapi import APIRouter, HTTPException

from schemas import OrganizerResponse
from services.organizer_service import (
    get_all_organizers,
    get_organizer_by_id,
)

router = APIRouter(prefix="/organizers", tags=["Organizers"])


@router.get("", response_model=list[OrganizerResponse])
def read_organizers():
    return get_all_organizers()


@router.get("/{organizer_id}", response_model=OrganizerResponse)
def read_organizer(organizer_id: int):
    organizer = get_organizer_by_id(organizer_id)

    if organizer is None:
        raise HTTPException(
            status_code=404,
            detail="Organizer not found",
        )

    return organizer
