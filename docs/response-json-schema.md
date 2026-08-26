# API response schemas

## Conventions

- JSON property names use `snake_case`.
- Nullable fields use `null`; arrays use `[]` when empty.
- IDs are integers.
- Timestamps are ISO 8601 strings.

## Endpoints

| Endpoint | Response |
|---|---|
| `GET /events` | `EventList[]` |
| `GET /events/{id}` | `Event` |
| `GET /event-categories` | `EventCategory[]` |
| `GET /event-categories/{id}` | `EventCategory` |
| `GET /topic-categories` | `TopicCategory[]` |
| `GET /topic-categories/{id}` | `TopicCategory` |
| `GET /organizers` | `Organizer[]` |
| `GET /organizers/{id}` | `Organizer` |

## EventList

Compact event returned by `GET /events`.

| Field | Type | Nullable | Description |
|---|---|---:|---|
| `id` | integer | NO | Event ID |
| `title` | string | NO | Event title |
| `location` | string | YES | Event location |
| `start_time` | ISO 8601 string | NO | Start date and time |
| `end_time` | ISO 8601 string | YES | End date and time |
| `created_at` | ISO 8601 string | NO | Creation date and time |
| `event_category` | `EventCategory` | NO | Event category |
| `organizer` | `Organizer` | NO | Event organizer |
| `topic_categories` | `TopicCategory[]` | NO | Event topics |

Example `GET /events` response:

```json
[
  {
    "id": 42,
    "title": "Introduction to APIs",
    "location": "Room 0089",
    "start_time": "2026-08-10T10:00:00+02:00",
    "end_time": "2026-08-10T14:00:00+02:00",
    "created_at": "2026-07-10T12:15:00+02:00",
    "event_category": {
      "id": 2,
      "title": "Workshop",
      "icon_name": "tools",
      "created_at": "2026-07-01T10:00:00+02:00"
    },
    "organizer": {
      "id": 3,
      "name": "Example Organization",
      "type": "ORGANIZATION",
      "logo_url": null,
      "website_url": "https://example.org",
      "description": "Technology education organization.",
      "created_at": "2026-07-01T10:00:00+02:00"
    },
    "topic_categories": [
      {
        "id": 5,
        "title": "Web Development",
        "icon_name": "web",
        "created_at": "2026-07-01T10:00:00+02:00"
      },
      {
        "id": 8,
        "title": "API Design",
        "icon_name": "api",
        "created_at": "2026-07-01T10:00:00+02:00"
      }
    ]
  }
]
```

## Event

Event returned by `GET /events/{id}`.

| Field | Type | Nullable | Description |
|---|---|---:|---|
| `id` | integer | NO | Event ID |
| `title` | string | NO | Event title |
| `description` | string | YES | Detailed event description |
| `location` | string | YES | Event location |
| `start_time` | ISO 8601 string | NO | Start date and time |
| `end_time` | ISO 8601 string | YES | End date and time |
| `created_at` | ISO 8601 string | NO | Creation date and time |
| `event_category` | `EventCategory` | NO | Event category |
| `organizer` | `Organizer` | NO | Event organizer |
| `topic_categories` | `TopicCategory[]` | NO | Event topics |

Example `GET /events/42` response:

```json
{
  "id": 42,
  "title": "Introduction to APIs",
  "description": "A practical introduction to designing and consuming HTTP APIs.",
  "location": "Room 0089",
  "start_time": "2026-08-10T10:00:00+02:00",
  "end_time": "2026-08-10T14:00:00+02:00",
  "created_at": "2026-07-10T12:15:00+02:00",
  "event_category": {
    "id": 2,
    "title": "Workshop",
    "icon_name": "tools",
    "created_at": "2026-07-01T10:00:00+02:00"
  },
  "organizer": {
    "id": 3,
    "name": "Example Organization",
    "type": "ORGANIZATION",
    "logo_url": null,
    "website_url": "https://example.org",
    "description": "Technology education organization.",
    "created_at": "2026-07-01T10:00:00+02:00"
  },
  "topic_categories": [
    {
      "id": 5,
      "title": "Web Development",
      "icon_name": "web",
      "created_at": "2026-07-01T10:00:00+02:00"
    },
    {
      "id": 8,
      "title": "API Design",
      "icon_name": "api",
      "created_at": "2026-07-01T10:00:00+02:00"
    }
  ]
}
```

## EventCategory

| Field | Type | Nullable | Description |
|---|---|---:|---|
| `id` | integer | NO | Event category ID |
| `title` | `EventCategoryTitle` | NO | `Lecture`, `Workshop`, `Networking`, `Conference`, or `Seminar` |
| `icon_name` | string | YES | Frontend icon identifier |
| `created_at` | ISO 8601 string | NO | Creation date and time |

## TopicCategory

| Field | Type | Nullable | Description |
|---|---|---:|---|
| `id` | integer | NO | Topic category ID |
| `title` | string | NO | Topic name |
| `icon_name` | string | YES | Frontend icon identifier |
| `created_at` | ISO 8601 string | NO | Creation date and time |

## Organizer

| Field | Type | Nullable | Description |
|---|---|---:|---|
| `id` | integer | NO | Organizer ID |
| `name` | string | NO | Organizer name |
| `type` | `OrganizerType` | NO | `PERSON` or `ORGANIZATION` |
| `logo_url` | string | YES | Logo URL |
| `website_url` | string | YES | Website URL |
| `description` | string | YES | Organizer description |
| `created_at` | ISO 8601 string | NO | Creation date and time |

## Error

| Field | Type | Nullable | Description |
|---|---|---:|---|
| `code` | string | NO | HTTP Error status code |
| `message` | string | NO | Error description |
| `details` | `ErrorDetail[]` | NO | Field errors |

### ErrorDetail

| Field | Type | Nullable | Description |
|---|---|---:|---|
| `field` | string | NO | Invalid field or parameter |
| `message` | string | NO | Validation message |

```json
{
  "code": "VALIDATION_ERROR",
  "message": "The request contains invalid values.",
  "details": [
    {
      "field": "event_id",
      "message": "Value must be an integer."
    }
  ]
}
```

| HTTP status | Error code |
|---|---|
| `400 Bad Request` | `BAD_REQUEST` |
| `404 Not Found` | `RESOURCE_NOT_FOUND` |
| `422 Unprocessable Content` | `VALIDATION_ERROR` |
| `500 Internal Server Error` | `INTERNAL_ERROR` |
