# Api request schemas

## Conventions

- JSON property names use `snake_case`.
- Nullable fields use `null`; arrays use `[]` when empty.
- IDs are integers.
- Timestamps are ISO 8601 strings.

## Endpoints

| Endpoint | Request Model |
|---|---|
| `POST /events` | `CreateEvent` |
| `PATCH /events/{id}` | `UpdateEvent` |
| `POST /event-categories` | `CreateEventCategory` |
| `PATCH /event-categories/{id}` | `UpdateEventCategory` |
| `POST /topic-categories` | `CreateTopicCategory` |
| `PATCH /topic-categories/{id}` | `UpdateTopicCategory` |
| `POST /organizers` | `CreateOrganizer` |
| `PATCH /organizers/{id}` |`UpdateOrganizer` |


## CreateEvent

| Field | Type | Optional | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | NO | NO | Event title |
| `location` | string | NO | YES | Event location |
| `start_time` | ISO 8601 string | NO | NO | Start date and time |
| `end_time` | ISO 8601 string | NO | YES | End date and time |
| `event_category_id` | integer | NO | NO | Event category id |
| `organizer_id` | integer | NO | NO | Event organizer id |
| `topic_category_id` | integer | NO | NO | Event topic category id |

Example `POST /events`

```json
{
    "title": "AI & Future Tech Summit",
    "location": "EXPO Krakow, Galicyjska 9",
    "start_time": "2026-10-15T09:00:00+02:00",
    "end_time": "2026-10-16T17:00:00+02:00",
    "event_category_id": 6,
    "organizer_id": 7,
    "topic_category_id": 4
}
```

## UpdateEvent

| Field | Type | Optional | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | YES | NO | Event title |
| `location` | string | YES | YES | Event location |
| `start_time` | ISO 8601 string | YES | NO | Start date and time |
| `end_time` | ISO 8601 string | YES | YES | End date and time |
| `event_category_id` | integer | YES | NO | Event category id |
| `organizer_id` | integer | YES | NO | Event organizer id |
| `topic_category_id` | integer | YES | NO | Event topic category id |

Example `PATCH /events/{id}` request(Change title and event duration):

```json
{
    "title": "AI Tech Summit",
    "start_time": "2026-10-15T09:03:00+02:00",
    "end_time": "2026-10-16T17:03:00+02:00"
}
```

## CreateEventCategory

| Field | Type | Optional | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | NO | NO | Category name |
| `icon_name` | string | NO | YES | Frontend icon identifier |

Example `POST /event-categories`

```json
{
    "title": "Conference",
    "icon_name": null
}
```

## UpdateEventCategory

| Field | Type | Optional | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | YES | NO | Category name |
| `icon_name` | string | YES | YES | Frontend icon identifier |

Example `PATCH /event-categories/{id}` request (updating only the title):

```json
{
    "title": "IT Conference"
}
```

## CreateTopicCategory

| Field | Type | Optional | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | NO | NO | Topic name |
| `icon_name` | string | NO | YES | Frontend icon identifier |

Example `POST /topic-categories` 

```json
{
    "title": "Python Programming",
    "icon_name": "snake"
}
```

## UpdateTopicCategory

| Field | Type | Optional | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | YES | NO | Topic name |
| `icon_name` | string | YES | YES | Frontend icon identifier |

Example `PATCH /topic-categories/{id}` request (updating icon name):

```json
{
    "icon_name": "laptop"
}
```

## CreateOrganizer

| Field | Type | Optional | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | string | NO | NO | Organizer name |
| `type` | string | NO | NO | `PERSON` or `ORGANIZATION` |
| `logo_url` | string | NO | YES | Logo URL |
| `website_url` | string | NO | YES | Website URL |
| `description` | string | NO | YES | Organizer description |

Example `POST /organizers`

 ```json
{
    "name": "Tech Event Sp. z o. o.",
    "type": "ORGANIZATION",
    "logo_url": "https://example.com/images/logo.png",
    "website_url": "https://techevents.pl",
    "description": "Organizer of biggest IT events"
}
```

## UpdateOrganizer

| Field | Type | Optional | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | string | YES | NO | Organizer name |
| `type` | string | YES | NO | `PERSON` or `ORGANIZATION` |
| `logo_url` | string | YES | YES | Logo URL |
| `website_url` | string | YES | YES | Website URL |
| `description` | string | YES | YES | Organizer description |

Example `PATCH /organizers/{id}` request (change description and website URL):

 ```json
{
    "description": "Organizer of the biggest IT and AI events in Europe.",
    "website_url": "https://new-techevents.pl"
}
```
