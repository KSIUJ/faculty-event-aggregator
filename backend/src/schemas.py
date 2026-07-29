from datetime import datetime
from pydantic import BaseModel


class EventCategoryResponse(BaseModel):
    id: int
    title: str


class OrganizerResponse(BaseModel):
    id: int
    name: str


class TopicCategoryResponse(BaseModel):
    id: int
    title: str


class EventResponse(BaseModel):
    id: int
    title: str
    description: str | None
    location: str | None
    start_time: datetime
    end_time: datetime | None
    created_at: datetime

    event_category: EventCategoryResponse
    topic_category: TopicCategoryResponse | None
    organizer: OrganizerResponse