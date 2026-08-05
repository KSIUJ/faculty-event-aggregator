from fastapi import FastAPI

from routers.event_categories import router as event_categories_router
from routers.events import router as events_router
from routers.organizers import router as organizers_router
from routers.topic_categories import router as topic_categories_router

app = FastAPI()


app.include_router(event_categories_router)
app.include_router(events_router)
app.include_router(organizers_router)
app.include_router(topic_categories_router)


@app.get("/")
async def root():
    return {"message": "Hello World!"}
