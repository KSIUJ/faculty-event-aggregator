# Faculty Event Aggregator

**Faculty Event Aggregator** is a web application for collecting, organizing, and presenting academic and faculty events in one place. 
<p align="center">
  <img src="./frontend/public/faculty-agenda-symbol.png" width="112" alt="Faculty Event Aggregator logo">
</p>

The application is built with [FastAPI](https://fastapi.tiangolo.com), [React](https://react.dev), [Vite](https://vite.dev), and [PostgreSQL](https://www.postgresql.org). 
Docker Compose is used to provide the local database.

## ✨ Features

- search events by title and description,
- filter by date and event category,
- browse paginated, category-coloured event cards,
- create events through a four-step validated form,
- inspect and delete existing events,
- open events in Google Calendar, Outlook, Apple Calendar, or another iCalendar-compatible application,
- expose individual event and complete calendar feeds in the iCalendar format,
- preserve API changes in PostgreSQL between application restarts.

## 📂 Project Structure & Setup

The repository is divided into two main parts. **Please refer to their respective README files for detailed step-by-step setup, configuration, and testing instructions:**

* ⚙️ [**`/backend`**](./backend/README.md) - REST API (FastAPI, PostgreSQL, Docker)
* 🎨 [**`/frontend`**](./frontend/README.md) - User interface (React, Vite)

### Quick Start
To get started, clone the repository:
```bash
git clone [https://github.com/KSIUJ/faculty-event-aggregator.git](https://github.com/KSIUJ/faculty-event-aggregator.git)
cd faculty-event-aggregator
```
*Then follow the instructions in the `/backend` and `/frontend` folders.*

## ⚙️ Configuration Overview

Both `frontend` and `backend` directories provide an `.env.example` file. 
You need to copy these to `.env` in their respective folders before starting the application. 

On the first backend startup, the application automatically imports sample organizers, categories, topics, and events from `docs/sampledata.json`. 
Existing records are preserved, so changes made via the API remain intact after a restart.

## 📚 Documentation & API

The repository includes the following API reference material:

- [Database schema](./docs/database-schema.md)
- [Request JSON schemas](./docs/request-json-schema.md)
- [Response JSON schemas](./docs/response-json-schema.md)
- [Sample API data](./docs/sampledata.json)

## Further implementations

- protect event submission and deletion with an authorization token,
- add dedicated reporting for inconsistent or incomplete stored data,
- extend automated integration and browser-level testing,
- prepare a production deployment configuration.

## 🛠️ Tech Stack

* 🐍 **Backend:** FastAPI (Python)
* ⚛️ **Frontend:** React + Vite
* 🐘 **Database:** PostgreSQL
* 🐳 **Containerization:** Docker & Docker Compose
