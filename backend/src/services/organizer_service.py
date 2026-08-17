from mock_data.organizers import ORGANIZERS
from datetime import datetime, timezone
from schemas import CreateOrganizer, UpdateOrganizer

def get_all_organizers():
    return ORGANIZERS


def get_organizer_by_id(organizer_id: int):
    return next(
        (organizer for organizer in ORGANIZERS if organizer["id"] == organizer_id),
        None,
    )


def create_organizer(organizer: CreateOrganizer):
    new_id = max(c["id"] for c in ORGANIZERS) + 1 if ORGANIZERS else 1
    
    new_organizer = {
        "id": new_id,
        "name": organizer.name,
        "type": organizer.type,
        "logo_url": organizer.logo_url,
        "website_url": organizer.website_url,
        "description": organizer.description,
    }
    
    ORGANIZERS.append(new_organizer)
    return new_organizer
    
def update_organizer(organizer_id: int, organizer: UpdateOrganizer):
    existing_organizer = next(
        (c for c in ORGANIZERS if c["id"] == organizer_id), None
    )
    if not existing_organizer:
        return None

    if organizer.name is not None:
        existing_organizer["name"] = organizer.name
    if organizer.type is not None:
        existing_organizer["type"] = organizer.type
    if organizer.logo_url is not None:
        existing_organizer["logo_url"] = organizer.logo_url
    if organizer.website_url is not None:
        existing_organizer["website_url"] = organizer.website_url
    if organizer.description is not None:
        existing_organizer["description"] = organizer.description

    return existing_organizer

def delete_organizer(organizer_id: int):
    existing_organizer = next(
        (c for c in ORGANIZERS if c["id"] == organizer_id), None
    )
    if not existing_organizer:
        return False
    ORGANIZERS.remove(existing_organizer)
    return True