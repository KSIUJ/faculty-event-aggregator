from datetime import UTC, datetime

ORGANIZERS = [
    {
        "id": 1,
        "name": "Python Community",
        "type": "ORGANIZATION",
        "logo_url": None,
        "website_url": "https://example.org",
        "description": "Python enthusiasts",
        "created_at": datetime(2026, 7, 1, tzinfo=UTC),
    },
    {
        "id": 2,
        "name": "Jan Jan Jan Jan Jan",
        "type": "PERSON",
        "logo_url": None,
        "website_url": None,
        "description": "Event organizer",
        "created_at": datetime(2026, 7, 1, 10, 0, tzinfo=UTC),
    },
]
