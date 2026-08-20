# Backend Test Suite

This directory contains integration and unit tests for the backend API endpoints using **pytest** and FastAPI's **TestClient**.

Tests run against an **isolated in-memory SQLite database**, meaning:
- You do **not** need Docker or a running PostgreSQL instance to run tests.
- Each test runs with a freshly created database schema and is completely independent.

---

## 🚀 Running Tests

Make sure you are in the `backend/` directory:

```bash
cd backend
```

### Run all tests
```bash
pytest tests/
```
*(Or with `uv`)*:
```bash
uv run pytest tests/
```

### Run with verbose output (`-v`)
```bash
pytest tests/ -v
```

---

## 📂 Running Specific Test Files

You can test individual endpoint categories separately:

| Endpoint Category | Test Command |
|---|---|
| **Events** | `pytest tests/test_events.py -v` |
| **Event Categories** | `pytest tests/test_event_categories.py -v` |
| **Organizers** | `pytest tests/test_organizers.py -v` |
| **Topic Categories** | `pytest tests/test_topic_categories.py -v` |
| **Root (`/`)** | `pytest tests/test_root.py -v` |

---

## 🔍 Useful Pytest Flags

- **Run a specific test function by name (`-k`)**:
  ```bash
  pytest tests/ -k "test_create_event"
  ```
- **Stop immediately on first failure (`-x`)**:
  ```bash
  pytest tests/ -x
  ```
- **Show stdout/print statements (`-s`)**:
  ```bash
  pytest tests/ -s
  ```

---

## 🛠️ Test Architecture

- **[`conftest.py`](file:///Users/maciej/Desktop/PR/faculty-event-aggregator/backend/tests/conftest.py)**: Configures the test database engine (`sqlite:///:memory:`), sets up automatic table creation/teardown (`setup_database`), and provides the `client` fixture with `get_db` dependency override.
- **`test_*.py`**: Test suites covering successful CRUD operations, HTTP status codes (`200`, `201`, `204`, `404`, `422`), foreign key relationship validations, and date range constraints.
