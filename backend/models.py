from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)  # "patient" or "doctor"

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    audio_file = Column(String, nullable=True)
    prediction = Column(String, nullable=True)
    abnormal = Column(Boolean, default=False)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    sender = Column(String)  # "doctor" or "patient"
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
