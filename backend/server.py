from fastapi import FastAPI, APIRouter, HTTPException, status, Depends, Body
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv
import logging
import random

# --- CONFIG ---
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'edulink_db')

# --- LOGGING ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("EduLinkBackend")

# --- DATABASE ---
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# --- APP SETUP ---
app = FastAPI(title="EduLink+ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# --- MODELS ---

class UserBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    role: Literal["student", "mentor", "teacher"]
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    
    # Mentor/Teacher specific
    subjects: List[str] = []
    hourly_rate: Optional[float] = 0.0
    title: Optional[str] = None # e.g. "Physics PhD Student"
    institution: Optional[str] = None # e.g. "NTUA"
    rating: float = 5.0
    reviews_count: int = 0

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    pass

class SessionBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mentor_id: str
    student_id: str
    mentor_name: str
    student_name: str
    subject: str
    date_time: datetime
    status: Literal["pending", "confirmed", "completed", "cancelled"] = "pending"
    meeting_link: Optional[str] = None
    price: float = 0.0
    notes: Optional[str] = None

class SessionCreate(BaseModel):
    mentor_id: str
    subject: str
    date_time: datetime
    notes: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

# --- HELPERS ---
def fix_id(doc):
    if doc and "_id" in doc:
        del doc["_id"]
    return doc

# --- ROUTES ---

@api_router.get("/")
async def root():
    return {"message": "EduLink+ API is running"}

# Auth (Mocked)
@api_router.post("/auth/login", response_model=dict)
async def login(creds: LoginRequest):
    user = await db.users.find_one({"email": creds.email})
    if not user:
        # For demo simplicity, if user doesn't exist, return a mock error or auto-register?
        # Let's stick to strict login for now, or auto-seed.
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {
        "token": "mock-jwt-token-" + user['id'],
        "user": fix_id(user)
    }

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.model_dump()
    # In real app, hash password
    await db.users.insert_one(user_dict)
    return user

# Users / Mentors
@api_router.get("/mentors", response_model=List[UserResponse])
async def get_mentors(role: Optional[str] = None, subject: Optional[str] = None):
    query = {}
    if role:
        query["role"] = role
    else:
        query["role"] = {"$in": ["mentor", "teacher"]}
        
    if subject:
        query["subjects"] = {"$in": [subject]}
        
    cursor = db.users.find(query, {"_id": 0})
    users = await cursor.to_list(length=100)
    return users

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Sessions
@api_router.post("/sessions", response_model=SessionBase)
async def book_session(session_in: SessionCreate, current_user_id: str = Body(..., embed=True)):
    # Get mentor details
    mentor = await db.users.find_one({"id": session_in.mentor_id})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
        
    # Get student details
    student = await db.users.find_one({"id": current_user_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_session = SessionBase(
        mentor_id=mentor['id'],
        student_id=student['id'],
        mentor_name=mentor['full_name'],
        student_name=student['full_name'],
        subject=session_in.subject,
        date_time=session_in.date_time,
        price=mentor.get('hourly_rate', 0),
        notes=session_in.notes,
        meeting_link=f"https://meet.google.com/mock-{uuid.uuid4().hex[:6]}"
    )
    
    await db.sessions.insert_one(new_session.model_dump())
    return new_session

@api_router.get("/sessions/my", response_model=List[SessionBase])
async def get_my_sessions(user_id: str):
    # Find sessions where user is either student or mentor
    cursor = db.sessions.find(
        {"$or": [{"student_id": user_id}, {"mentor_id": user_id}]},
        {"_id": 0}
    ).sort("date_time", 1)
    return await cursor.to_list(length=100)

# Seeding Endpoint (CRITICAL FOR DEMO)
@api_router.post("/seed")
async def seed_db():
    await db.users.delete_many({})
    await db.sessions.delete_many({})
    
    # Sample Users
    users = [
        {
            "id": "student1", "email": "student@demo.com", "password": "123", "full_name": "Giorgos Papadopoulos",
            "role": "student", "avatar_url": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
            "bio": "High school student interested in Physics and Math."
        },
        {
            "id": "mentor1", "email": "mentor@demo.com", "password": "123", "full_name": "Eleni Andreou",
            "role": "mentor", "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            "bio": "3rd year ECE student at NTUA. I love teaching Math!",
            "subjects": ["Mathematics", "Physics"], "hourly_rate": 0, "institution": "NTUA",
            "title": "Engineering Student"
        },
        {
            "id": "teacher1", "email": "teacher@demo.com", "password": "123", "full_name": "Dr. Nikos Dimou",
            "role": "teacher", "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
            "bio": "Professional Physics teacher with 15 years experience.",
            "subjects": ["Physics", "Chemistry"], "hourly_rate": 25, "institution": "Private School",
            "title": "Senior Physics Teacher"
        },
        {
            "id": "mentor2", "email": "mentor2@demo.com", "password": "123", "full_name": "Maria K.",
            "role": "mentor", "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
            "bio": "Literature student. Can help with Ancient Greek.",
            "subjects": ["Ancient Greek", "History"], "hourly_rate": 0, "institution": "UoA",
            "title": "Philology Student"
        }
    ]
    
    for u in users:
        await db.users.insert_one(UserCreate(**u).model_dump())
        
    return {"message": "Database seeded successfully"}

app.include_router(api_router)
