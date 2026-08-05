from mock_data.organizers import ORGANIZERS


def get_all_organizers():
    return ORGANIZERS


def get_organizer_by_id(organizer_id: int):
    return next(
        (organizer for organizer in ORGANIZERS if organizer["id"] == organizer_id),
        None,
    )
