from datetime import datetime

EVENTS = [
    {
        "id": 1,
        "title": "Introduction to FastAPI",
        "description": "Learn the basics of FastAPI.",
        "location": "Online",
        "start_time": datetime(2026, 8, 10, 18, 0),
        "end_time": datetime(2026, 8, 10, 20, 0),
        "created_at": datetime(2026, 7, 20, 12, 0),
        "event_category": {
            "id": 1,
            "title": "Workshop",
            "icon_name": "tools",
            "created_at": datetime(2026, 7, 1),
        },
        "topic_category": {
            "id": 2,
            "title": "Backend",
            "icon_name": "server",
            "created_at": datetime(2026, 7, 1),
        },
        "organizer": {
            "id": 1,
            "name": "Python Community",
            "type": "ORGANIZATION",
            "logo_url": None,
            "website_url": "https://example.org",
            "description": "Python enthusiasts",
            "created_at": datetime(2026, 7, 1),
        },
    }
]