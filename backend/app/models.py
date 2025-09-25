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

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    position = Column(Integer, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    updated_at = Column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    permissions = Column(String, nullable=True) # Comma-separated permissions

"""
    PERMISSIONS:

    - manage_roles  | can create, read, update, delete roles with a higher position value

    - create_users  | can create users with roles with higher position value
    - read_users    | can read users with roles with higher position value
    - update_users  | can update users with roles with higher position value
    - delete_users  | can delete users with roles with higher position value

    - create_samples  | can create samples
    - read_samples    | can read samples
    - update_samples  | can update samples
    - delete_samples  | can delete samples

    - create_tests  | can create tests
    - read_tests    | can read tests
    - update_tests  | can update tests
    - delete_tests  | can delete tests

    - create_results  | can create results
    - read_results    | can read results
    - update_results  | can update results
    - delete_results  | can delete results
    - validate_results | can validate results
    - publish_results  | can publish results

"""
