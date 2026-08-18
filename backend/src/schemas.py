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


# REQUEST SCHEMAS

class CreateEventCategory(BaseModel):
    title: str
    icon_name: str | None = None

class UpdateEventCategory(BaseModel):
    title: str | None = None
    icon_name: str | None = None

class CreateOrganizer(BaseModel):
    name: str
    type: str
    logo_url: str | None = None
    website_url: str | None = None
    description: str | None = None

class UpdateOrganizer(BaseModel):
    name: str | None = None
    type: str | None = None
    logo_url: str | None = None
    website_url: str | None = None
    description: str | None = None

class CreateTopicCategory(BaseModel):
    title: str
    icon_name: str | None = None

class UpdateTopicCategory(BaseModel):
    title: str | None = None
    icon_name: str | None = None

class CreateEvent(BaseModel):
    title: str
    location: str | None = None
    start_time: datetime
    end_time: datetime | None = None
    event_category_id: int
    organizer_id: int
    topic_category_ids: list[int] 

class UpdateEvent(BaseModel):
    title: str | None = None
    location: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    event_category_id: int | None = None
    organizer_id: int | None = None
    topic_category_ids: list[int] | None = None