import os
from pathlib import Path
from datetime import datetime, timezone

from sqlalchemy import (Boolean, Column, Date, DateTime, Float, ForeignKey,
                        Integer, String, Text, create_engine, inspect, text)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

try:  # read settings from a .env file next to this script, if python-dotenv is installed
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent / ".env")
except ImportError:
    pass

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./susambil.db")
if DATABASE_URL.startswith("postgres://"):  # Render/Heroku style URL
    DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://"):]


def _now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=_connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class TourItem(Base):
    __tablename__ = "tour_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    item_type = Column(String(20), nullable=False, index=True)  # hotel | transport | experience
    location = Column(String(120), nullable=False, index=True)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=False)
    duration = Column(String(80), nullable=True)

    bookings = relationship("Booking", back_populates="item", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="item", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("tour_items.id"), nullable=False, index=True)
    customer_name = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="pending", server_default="pending", index=True)
    created_at = Column(DateTime, default=_now)

    item = relationship("TourItem", back_populates="bookings")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("tour_items.id"), nullable=False, index=True)
    author_name = Column(String(120), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)

    item = relationship("TourItem", back_populates="reviews")


class Guide(Base):
    __tablename__ = "guides"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    city = Column(String(120), nullable=False)
    languages = Column(String(200), nullable=False)
    experience_years = Column(Integer, nullable=False, default=0)
    bio = Column(Text, nullable=False)
    price_per_day = Column(Float, nullable=False)
    profile_image_url = Column(String(500), nullable=False)
    certificate_url = Column(String(500), nullable=False)
    is_verified = Column(Boolean, nullable=False, default=False, index=True)
    rating = Column(Float, nullable=False, default=0.0)
    points = Column(Integer, nullable=False, default=100)
    completed_tours = Column(Integer, nullable=False, default=0)
    badge = Column(String(80), nullable=True)

    bookings = relationship("GuideBooking", back_populates="guide", cascade="all, delete-orphan")


class GuideBooking(Base):
    __tablename__ = "guide_bookings"

    id = Column(Integer, primary_key=True, index=True)
    guide_id = Column(Integer, ForeignKey("guides.id"), nullable=False, index=True)
    customer_name = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="pending", server_default="pending", index=True)
    created_at = Column(DateTime, default=_now)

    guide = relationship("Guide", back_populates="bookings")


class TravelPost(Base):
    __tablename__ = "travel_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    image_url = Column(String(500), nullable=False)
    location = Column(String(120), nullable=False)
    author_name = Column(String(120), nullable=False)
    hashtags = Column(String(300), nullable=True)
    like_count = Column(Integer, nullable=False, default=0)

    comments = relationship("PostComment", back_populates="post",
                            cascade="all, delete-orphan", order_by="PostComment.id")


class PostComment(Base):
    __tablename__ = "post_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("travel_posts.id"), nullable=False, index=True)
    author_name = Column(String(120), nullable=False)
    comment = Column(Text, nullable=False)

    post = relationship("TravelPost", back_populates="comments")


def ensure_columns() -> None:
    """Add columns introduced after the first release to an existing database."""
    insp = inspect(engine)
    ts = "DATETIME" if engine.dialect.name == "sqlite" else "TIMESTAMP"
    new_cols = [("status", "VARCHAR(20) NOT NULL DEFAULT 'pending'"), ("created_at", ts)]
    with engine.begin() as conn:
        for table in ("bookings", "guide_bookings"):
            if not insp.has_table(table):
                continue
            have = {c["name"] for c in insp.get_columns(table)}
            for name, ddl in new_cols:
                if name not in have:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))
