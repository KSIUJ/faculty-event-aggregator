Faculty Event Aggregator - Backend

This is the backend API for the Faculty Event Aggregator, built with FastAPI and PostgreSQL.

## ⚙️ Prerequisites
- Python 3.11+
- Docker & Docker Compose (for the database)

## 🚀 Setup & Run (Step-by-Step)

**1. Create the environment file:**
```bash
cp .env.example .env
```

**2. Virtual Environment & Dependencies:**
Create and activate a virtual environment, then install required packages:
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows Git Bash (use 'source venv/bin/activate' on Mac/Linux)
pip install -r requirements.txt
```

**3. Start the Database:**
The PostgreSQL 15 database runs in a Docker container defined in `docker-compose.yml`.
```bash
docker compose up -d
```
> **Note:** When starting for the first time, it automatically imports sample data configured by `SAMPLE_DATA_PATH` in `.env`.

**4. Run the Backend Server:**
Ensure you are in the main `backend` directory (where the `src` folder is located), then run:
```bash
uvicorn main:app --app-dir src --reload
```

## 🔗 Endpoints
Once the server is running, you can access the application here:
- **API Base URL:** http://127.0.0.1:8000
- **Swagger UI (Docs):** http://127.0.0.1:8000/docs

## 🐳 Database Details & Useful Commands

The `docker-compose up -d` command starts a PostgreSQL 15 instance with the following defaults:
- **Host:** `localhost`
- **Port:** `5432`
- **User:** `dev_user`
- **Password:** `dev_password`
- **Database:** `local_database`

The database data is kept in the `postgres_data` volume, so it persists between restarts.

- Check if the container is running: `docker compose ps`
- Stop the database: `docker compose down`
- Stop and **remove all data**: `docker compose down -v`

## 🧪 Running Tests

Run the test suite using `pytest` (tests use an in-memory SQLite database and do not require Docker to be running):
```bash
pytest tests/ -v
```

See [tests/README.md](tests/README.md) for more details and specific test commands.