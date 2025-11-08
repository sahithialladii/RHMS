from fastapi import FastAPI, UploadFile, File, Form, Depends, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import shutil, os

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models, auth, utils

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
templates = Jinja2Templates(directory="templates")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------
# Home / test page
# -------------------
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# -------------------
# Signup
# -------------------
@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...), role: str = Form(...), db: Session = Depends(get_db)):
    hashed_pw = auth.hash_password(password)
    user = models.User(username=username, password=hashed_pw, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"msg": "User created", "user_id": user.id}

# -------------------
# Login
# -------------------
@app.post("/login")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username==username).first()
    if not user or not auth.verify_password(password, user.password):
        return JSONResponse({"error": "Invalid credentials"}, status_code=401)
    token = auth.create_access_token({"user_id": user.id, "role": user.role})
    return {"access_token": token, "role": user.role, "user_id": user.id}

# -------------------
# Upload audio
# -------------------
# @app.post("/upload_audio")
# def upload_audio(user_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
#     save_path = f"uploads/{file.filename}"
#     with open(save_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
    
#     result = utils.predict_audio(save_path)
    
#     # save/update patient record
#     patient = db.query(models.Patient).filter(models.Patient.user_id==user_id).first()
#     if not patient:
#         patient = models.Patient(user_id=user_id)
#     patient.audio_file = save_path
#     patient.prediction = result["prediction"]
#     patient.abnormal = result["prediction"] != "normal"
#     db.add(patient)
#     db.commit()
    
#     return {"result": result, "connect_to_doctor": patient.abnormal}




@app.post("/upload_audio")
def upload_audio(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # save file
    save_path = f"uploads/{file.filename}"
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # run DL inference
    result = utils.predict_audio(save_path)
    
    # create a dummy patient for testing
    dummy_user_id = 1
    patient = db.query(models.Patient).filter(models.Patient.user_id==dummy_user_id).first()
    if not patient:
        patient = models.Patient(user_id=dummy_user_id)
    patient.audio_file = save_path
    patient.prediction = result["prediction"]
    patient.abnormal = result["prediction"] != "normal"
    db.add(patient)
    db.commit()
    
    return {"result": result, "connect_to_doctor": patient.abnormal}


# -------------------
# Dummy chat endpoints
# -------------------
@app.post("/send_message")
def send_message(patient_id: int = Form(...), sender: str = Form(...), content: str = Form(...), db: Session = Depends(get_db)):
    msg = models.Message(patient_id=patient_id, sender=sender, content=content)
    db.add(msg)
    db.commit()
    return {"msg": "Message sent"}

@app.get("/get_messages/{patient_id}")
def get_messages(patient_id: int, db: Session = Depends(get_db)):
    msgs = db.query(models.Message).filter(models.Message.patient_id==patient_id).order_by(models.Message.timestamp).all()
    return [{"sender": m.sender, "content": m.content, "timestamp": str(m.timestamp)} for m in msgs]
