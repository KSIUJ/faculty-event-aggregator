# How to run the application?

## Requirements

- Python 3.11+
- Dependencies listed in `requirements.txt`

Install all dependencies:

```bash
pip install -r requirements.txt
```

How to install python and pip? Go to the website:

```bash
https://www.python.org/downloads/
```

When installing python, check the box that installs pip.

## Database with Docker

The PostgreSQL database runs in a Docker container defined in `docker-compose.yml`.

Requirements:

- [Docker](https://docs.docker.com/get-docker/)
- Docker Compose (bundled with Docker Desktop)

Start the database:

```bash
docker compose up -d
```

This starts a PostgreSQL 15 instance with the following defaults:

- Host: `localhost`
- Port: `5432`
- User: `dev_user`
- Password: `dev_password`
- Database: `local_database`

When the application starts for the first time, it imports the organizers,
categories, and events from the file configured by `SAMPLE_DATA_PATH` in
`.env` (by default `../docs/sampledata.json`). Existing records are preserved
and matching sample records are not duplicated. A database marker ensures that
the import is performed only once, so events added or deleted through the API
remain changed after an application restart. The PostgreSQL volume stores the
data.

Check that the container is running:

```bash
docker compose ps
```

Stop the database:

```bash
docker compose down
```

The database data is kept in the `postgres_data` volume, so it persists between restarts. To remove the data as well, run `docker compose down -v`.

## Before first run

Make sure all requirements are installed before starting the application.

Start the database first (see [Database with Docker](#database-with-docker)):

```bash
docker compose up -d
```

Run the backend server:

```bash
uvicorn main:app --app-dir src --reload
```

The application will start at:
```bash
http://127.0.0.1:8000
```
API documentation is available at:

```bash
http://127.0.0.1:8000/docs
```

## Running Tests

Run the test suite using `pytest` (tests use an in-memory SQLite database and do not require Docker to be running):

```bash
pytest tests/ -v
```

See [tests/README.md](tests/README.md) for more details and specific test commands.
