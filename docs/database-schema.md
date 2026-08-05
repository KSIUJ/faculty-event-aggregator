# 📌 Proposed Database Schema

---

## 🗓️ Event

Represents an event published in the system.

| Field               | Data Type | Description                                                      |
|---------------------|-----------|------------------------------------------------------------------|
| `id`                | BIGINT    | **Primary Key**                                                  |
| `title`             | VARCHAR   | Event title                                                      |
| `description`       | TEXT      | Detailed information about the event                             |
| `location`          | VARCHAR   | Place where the event takes place                                |
| `start_time`        | TIMESTAMP | Event start date and time                                        |
| `end_time`          | TIMESTAMP | Event end date and time                                          |
| `created_at`        | TIMESTAMP | Date and time when the record was created                        |
| `topic_category_id` | BIGINT    | Foreign Key → TopicCategory                                      |
| `event_category_id` | BIGINT    | Foreign Key → EventCategory                                      |
| `organizer_id`      | BIGINT    | Foreign Key → Organizer                                          |
| `search_vector`     | TSVECTOR  | Full-text search index based on title, description, and location |

---

## 🏷️ EventCategory

Represents the type or format of an event.

| Field        | Data Type | Description                                        |
|--------------|-----------|----------------------------------------------------|
| `id`         | BIGINT    | **Primary Key**                                    |
| `title`      | VARCHAR   | Event type name (e.g., lecture, webinar, workshop) |
| `icon_name`  | VARCHAR   | Icon identifier mapped to an emoji by the frontend |
| `created_at` | TIMESTAMP | Date and time when the record was created          |

---

## 📚 TopicCategory

Represents the main subject area or topic of an event.

| Field        | Data Type | Description                                         |
|--------------|-----------|-----------------------------------------------------|
| `id`         | BIGINT    | **Primary Key**                                     |
| `title`      | VARCHAR   | Topic name (e.g., Web Development, AI, Soft Skills) |
| `icon_name`  | VARCHAR   | Icon identifier mapped to an emoji by the frontend  |
| `created_at` | TIMESTAMP | Date and time when the record was created           |

---

## 👤 Organizer

Represents an organization or person responsible for organizing events.

| Field           | Data Type      | Description                                          |
|-----------------|----------------|------------------------------------------------------|
| `id`            | BIGINT         | **Primary Key**                                      |
| `name`          | VARCHAR        | Organizer name                                       |
| `type`          | VARCHAR / ENUM | Organizer type (e.g., PERSON, ORGANIZATION)          |
| `logo_url`      | VARCHAR        | URL pointing to the organizer's logo or photo        |
| `website_url`   | VARCHAR        | Organizer's website address                          |
| `description`   | TEXT           | Short description of the organizer                   |
| `created_at`    | TIMESTAMP      | Date and time when the record was created            |
| `search_vector` | TSVECTOR       | Full-text search index based on name and description |

---

## 👥 User (In the future)

Represents application users who can browse, save, or interact with events.

| Field           | Data Type      | Description                               |
|-----------------|----------------|-------------------------------------------|
| `id`            | BIGINT         | **Primary Key**                           |
| `email`         | VARCHAR        | User email address                        |
| `nick`          | VARCHAR        | User nickname                             |
| `password_hash` | VARCHAR        | Hashed user password                      |
| `role`          | VARCHAR / ENUM | User role (e.g., student, admin)          |
| `created_at`    | TIMESTAMP      | Date and time when the record was created |

---

# 🔗 Relationships

- One **Organizer** can organize multiple **Events**.
- One **EventCategory** can contain multiple **Events**.
- One **TopicCategory** can contain multiple **Events**.
- One **User** can interact with multiple **Events**.
