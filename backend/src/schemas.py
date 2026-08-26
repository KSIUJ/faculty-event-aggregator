from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict


class EventCategoryTitle(StrEnum):
    LECTURE = "Lecture"
    WORKSHOP = "Workshop"
    NETWORKING = "Networking"
    CONFERENCE = "Conference"
    SEMINAR = "Seminar"


class OrganizerType(StrEnum):
    PERSON = "PERSON"
    ORGANIZATION = "ORGANIZATION"


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class EventCategoryResponse(BaseResponse):
    id: int
    title: EventCategoryTitle
    icon_name: str | None = None
    created_at: datetime


class OrganizerResponse(BaseResponse):
    id: int
    name: str
    type: OrganizerType
    logo_url: str | None = None
    website_url: str | None = None
    description: str | None = None
    created_at: datetime


class TopicCategoryResponse(BaseResponse):
    id: int
    title: str
    icon_name: str | None = None
    created_at: datetime


class EventListResponse(BaseResponse):
    id: int
    title: str
    description: str | None = None
    location: str | None = None
    start_time: datetime
    end_time: datetime | None = None
    created_at: datetime

    event_category: EventCategoryResponse
    topic_categories: list[TopicCategoryResponse]
    organizer: OrganizerResponse


class EventResponse(EventListResponse):
    pass


# REQUEST SCHEMAS

class CreateEventCategory(BaseModel):
    title: EventCategoryTitle
    icon_name: str | None = None


class UpdateEventCategory(BaseModel):
    title: EventCategoryTitle | None = None
    icon_name: str | None = None


class CreateOrganizer(BaseModel):
    name: str
    type: OrganizerType
    logo_url: str | None = None
    website_url: str | None = None
    description: str | None = None


class UpdateOrganizer(BaseModel):
    name: str | None = None
    type: OrganizerType | None = None
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
    description: str | None = None
    location: str | None = None
    start_time: datetime
    end_time: datetime | None = None
    event_category_id: int
    organizer_id: int
    topic_category_ids: list[int]


class UpdateEvent(BaseModel):
    title: str | None = None
    description: str | None = None
    location: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    event_category_id: int | None = None
    organizer_id: int | None = None
    topic_category_ids: list[int] | None = None
