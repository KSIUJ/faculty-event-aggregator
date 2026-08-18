from fastapi import APIRouter, HTTPException

from schemas import OrganizerResponse, CreateOrganizer, UpdateOrganizer
from services.organizer_service import (
    get_all_organizers,
    get_organizer_by_id,
    delete_organizer,
    update_organizer,
    create_organizer
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

@router.post("", response_model=OrganizerResponse, status_code=201)
def add_organizer(organizer: CreateOrganizer):
    return create_organizer(organizer)

@router.patch("/{organizer_id}", response_model=OrganizerResponse )
def modify_organizer(organizer_id: int , Organizer: UpdateOrganizer):
    updated_organizer = update_organizer(organizer_id, Organizer)

    if not updated_organizer:
        raise HTTPException(status_code=404, detail="Organizer not found")
    return updated_organizer
@router.delete("/{organizer_id}",status_code=204)
def remove_organizer(organizer_id: int):
    success = delete_organizer(organizer_id)

    if not success:
        raise HTTPException(status_code=404, detail="Organizer not found")
    
    return None