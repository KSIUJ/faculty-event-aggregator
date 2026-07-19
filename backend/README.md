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

## Before first run

Make sure all requirements are installed before starting the application.

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