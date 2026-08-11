from sqlalchemy import Column, String, Text, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import relationship, declarative_base


Base = declarative_base()

class Event(Base):
    __tablename__ = "event"
    id = Column(BigInteger, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False)
    organizer_id = Column(BigInteger, ForeignKey("organizer.id"), nullable=False)
    event_category_id = Column(BigInteger, ForeignKey("event_category.id"), nullable=False)
    topic_category_id = Column(BigInteger,ForeignKey("topic_category.id"), nullable=False)

    event_category = relationship("EventCategory", back_populates="event")
    topic_category = relationship("TopicCategory", back_populates="event")
    organizer = relationship("Organizer", back_populates="event")

class EventCategory(Base):
    __tablename__ = "event_category"

    id = Column(BigInteger, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    icon_name = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False)

    events = relationship("Event", back_populates="event_category")

class Organizer(Base):
    __tablename__ = "organizer"

    id = Column(BigInteger, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False)

    events = relationship("Event", back_populates="organizer")

class TopicCategory(Base):
    __tablename__ = "topic_category"

    id = Column(BigInteger, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    icon_name = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False)

    events = relationship("Event", back_populates="topic_category")

