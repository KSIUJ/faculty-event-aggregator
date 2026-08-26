from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import SessionLocal, engine
from models import Base
from routers import (
    event_categories_router,
    events_router,
    organizers_router,
    topic_categories_router,
)
from seed import seed_database_from_sample_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_database_from_sample_data(db)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(event_categories_router)
app.include_router(events_router)
app.include_router(organizers_router)
app.include_router(topic_categories_router)


@app.get("/")
async def root():
    return {"message": "Hello World!"}
