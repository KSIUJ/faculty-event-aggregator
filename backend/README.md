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
uvicorn src.main:app --reload
```

The application will start at:
```bash
http://127.0.0.1:8000
```
API documentation is available at:

```bash
http://127.0.0.1:8000/docs
```
