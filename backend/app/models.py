from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=True, unique=True)
    password_hash = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    roles = Column(String, nullable=True)
