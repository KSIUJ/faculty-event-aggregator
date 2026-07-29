from sqlalchemy import Column, String, Text, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import relationship, declarative_base


Base = declarative_base()

class Event(Base):
    __tablename__ = 'event'

    id = Column(BigInteger, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    location = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    created_at = Column(DateTime)
    organizer_id = Column(BigInteger, ForeignKey('organizer.id'))
    event_category_id = Column(BigInteger, ForeignKey('event_category.id'))
    topic_category_id = Column(BigInteger,ForeignKey('topic_category.id'))

    event_category = relationship("EventCategory", back_populates="event")
    topic_category = relationship("TopicCategory", back_populates="event")
    organizer = relationship("Organizer", back_populates="event")

class EventCategory(Base):
    __tablename__ = 'event_category'

    id = Column(BigInteger, primary_key=True)
    icon_name = Column(String)
    created_at = Column(DateTime)
    title = Column(String, nullable=False)

    event = relationship("Event", back_populates="event_category")

class Organizer(Base):
    __tablename__ = 'organizer'

    id = Column(BigInteger, primary_key=True)
    name = Column(String)
    type = Column(String)
    logo_url = Column(String)
    website_url = Column(String)
    description = Column(Text)
    created_at = Column(DateTime)

    event = relationship("Event", back_populates="organizer")

class TopicCategory(Base):
    __tablename__ = 'topic_category'

    id = Column(BigInteger, primary_key=True)
    icon_name = Column(String)
    created_at = Column(DateTime)
    title = Column(String, nullable=False)

    event = relationship("Event", back_populates="topic_category")

