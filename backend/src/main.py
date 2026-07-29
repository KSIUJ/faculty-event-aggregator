from fastapi import FastAPI
from routers.events import router as events_router


app = FastAPI()

app.include_router(events_router)

@app.get("/")
async def root():
    return {"message": "Hello World!" }

