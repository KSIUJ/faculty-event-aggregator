from typing import TypeVar
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from config import settings


DATABASE_URL = (
    f"postgresql://{settings.DB_USER}:{settings.DB_PASS}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

ModelType = TypeVar("ModelType")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Util functions
def commit(db: Session) -> None:
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

def commit_and_refresh(db: Session, instance: ModelType) -> ModelType:
    commit(db)
    db.refresh(instance)
    return instance