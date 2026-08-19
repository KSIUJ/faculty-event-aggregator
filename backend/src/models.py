from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    func,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

event_topic_category = Table(
    "event_topic_category",
    Base.metadata,
    Column("event_id", Integer, ForeignKey("event.id", ondelete="CASCADE"), primary_key=True),
    Column("topic_category_id", Integer, ForeignKey("topic_category.id", ondelete="CASCADE"), primary_key=True),
)


# Event Model
class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
    )
    organizer_id = Column(Integer, ForeignKey("organizer.id"), nullable=False)
    event_category_id = Column(Integer, ForeignKey("event_category.id"), nullable=False)

    event_category = relationship("EventCategory", back_populates="events")
    organizer = relationship("Organizer", back_populates="events")
    topic_categories = relationship("TopicCategory", secondary=event_topic_category, back_populates="events")


# Event Category Model
class EventCategory(Base):
    __tablename__ = "event_category"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    icon_name = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
    )

    events = relationship("Event", back_populates="event_category")


# Organizer Model
class Organizer(Base):
    __tablename__ = "organizer"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
    )

    events = relationship("Event", back_populates="organizer")


# Topic Category Model
class TopicCategory(Base):
    __tablename__ = "topic_category"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    icon_name = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
    )

    events = relationship("Event", secondary=event_topic_category, back_populates="topic_categories")