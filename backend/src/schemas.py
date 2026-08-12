from datetime import datetime

from pydantic import BaseModel


class EventCategoryResponse(BaseModel):
    id: int
    title: str
    icon_name: str | None
    created_at: datetime


class OrganizerResponse(BaseModel):
    id: int
    name: str
    type: str
    logo_url: str | None
    website_url: str | None
    description: str | None
    created_at: datetime


class TopicCategoryResponse(BaseModel):
    id: int
    title: str
    icon_name: str | None
    created_at: datetime


class EventListResponse(BaseModel):
    id: int
    title: str
    location: str | None
    start_time: datetime
    end_time: datetime | None
    created_at: datetime

    event_category: EventCategoryResponse
    topic_categories: list[TopicCategoryResponse] | None
    organizer: OrganizerResponse


class EventResponse(EventListResponse):
    description: str | None
