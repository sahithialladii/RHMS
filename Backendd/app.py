# # # """
# # # app.py

# # # Flask backend:
# # # - JWT auth (register/login)
# # # - Profile completion flow (notification on first login)
# # # - Patient audio upload -> DL model inference -> store result
# # # - Patients can request connection to doctors
# # # - Doctors can see patients who requested to connect to them

# # # Requirements (pip):
# # # flask flask_sqlalchemy flask_cors pyjwt passlib librosa numpy soundfile werkzeug
# # # tensorflow (optional if you have a TF/Keras model)
# # # """
# # # import os
# # # import uuid
# # # import datetime
# # # from functools import wraps

# # # from flask import Flask, request, jsonify
# # # from flask_sqlalchemy import SQLAlchemy
# # # from flask_cors import CORS
# # # from werkzeug.utils import secure_filename
# # # from passlib.hash import bcrypt
# # # import jwt
# # # import numpy as np


# # # # Optional imports for audio processing / model
# # # try:
# # #     import librosa
# # # except Exception:
# # #     librosa = None

# # # try:
# # #     import tensorflow as tf
# # # except Exception:
# # #     tf = None

# # # # -------------------- Config --------------------
# # # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# # # UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
# # # os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # # JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-change-me")
# # # JWT_ALGORITHM = "HS256"
# # # ACCESS_TOKEN_EXPIRES_MINUTES = 60 * 24  # 24 hours

# # # # Give path to your model (optional). If not present, backend will mock output.
# # # MODEL_PATH = os.path.join(BASE_DIR, "model", "lung_model.h5")  # example Keras h5

# # # # -------------------- App & DB --------------------
# # # app = Flask(__name__)
# # # CORS(app, supports_credentials=True)
# # # app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "app.db")
# # # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# # # app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# # # db = SQLAlchemy(app)

# # # # -------------------- DB Models --------------------
# # # class User(db.Model):
# # #     __tablename__ = "users"
# # #     id = db.Column(db.Integer, primary_key=True)
# # #     name = db.Column(db.String(120), nullable=True)
# # #     email = db.Column(db.String(150), unique=True, nullable=False)
# # #     password_hash = db.Column(db.String(255), nullable=False)
# # #     role = db.Column(db.String(20), nullable=False)  # "patient" or "doctor"
# # #     profile_complete = db.Column(db.Boolean, default=False)
# # #     # optional profile fields
# # #     phone = db.Column(db.String(50))
# # #     age = db.Column(db.Integer)
# # #     gender = db.Column(db.String(20))
# # #     address = db.Column(db.String(255))
# # #     specialization = db.Column(db.String(255))  # for doctors

# # # class PatientRecord(db.Model):
# # #     __tablename__ = "patient_records"
# # #     id = db.Column(db.Integer, primary_key=True)
# # #     patient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
# # #     filename = db.Column(db.String(255), nullable=False)
# # #     result = db.Column(db.String(255))
# # #     created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# # # class ConnectionRequest(db.Model):
# # #     __tablename__ = "connections"
# # #     id = db.Column(db.Integer, primary_key=True)
# # #     patient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
# # #     doctor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
# # #     status = db.Column(db.String(50), default="pending")  # pending/accepted/rejected
# # #     created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# # # # -------------------- Utility Helpers --------------------
# # # def create_access_token(user_id: int):
# # #     payload = {
# # #         "sub": user_id,
# # #         "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
# # #     }
# # #     token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
# # #     return token

# # # def decode_access_token(token: str):
# # #     try:
# # #         payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
# # #         return payload
# # #     except jwt.ExpiredSignatureError:
# # #         return None
# # #     except Exception:
# # #         return None

# # # def auth_required(role=None):
# # #     """
# # #     Decorator to protect routes. Optionally restrict to role ('patient' or 'doctor').
# # #     Expects Authorization: Bearer <token>
# # #     """
# # #     def decorator(fn):
# # #         @wraps(fn)
# # #         def wrapper(*args, **kwargs):
# # #             auth_header = request.headers.get("Authorization", "")
# # #             if not auth_header.startswith("Bearer "):
# # #                 return jsonify({"message": "Missing or invalid Authorization header"}), 401
# # #             token = auth_header.split(" ", 1)[1].strip()
# # #             payload = decode_access_token(token)
# # #             if not payload:
# # #                 return jsonify({"message": "Invalid or expired token"}), 401
# # #             user = User.query.get(payload["sub"])
# # #             if not user:
# # #                 return jsonify({"message": "User not found"}), 404
# # #             if role and user.role != role:
# # #                 return jsonify({"message": "Forbidden: incorrect role"}), 403
# # #             # attach current_user to request context
# # #             request.current_user = user
# # #             return fn(*args, **kwargs)
# # #         return wrapper
# # #     return decorator

# # # def allowed_file(filename):
# # #     ALLOWED = {"wav", "mp3", "m4a"}
# # #     return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED

# # # # -------------------- Load Model (if available) --------------------
# # # MODEL = None
# # # if tf and os.path.exists(MODEL_PATH):
# # #     try:
# # #         MODEL = tf.keras.models.load_model(MODEL_PATH)
# # #         app.logger.info("Model loaded from %s", MODEL_PATH)
# # #     except Exception as e:
# # #         app.logger.warning("Failed to load model: %s", e)
# # #         MODEL = None
# # # else:
# # #     if not tf:
# # #         app.logger.info("TensorFlow not available — using mock predictor.")
# # #     else:
# # #         app.logger.info("No model file found at %s — using mock predictor.", MODEL_PATH)

# # # def preprocess_audio_and_predict(path):
# # #     """
# # #     Load audio, extract features expected by your model and predict.
# # #     This example uses MFCC mean as a toy feature vector.
# # #     Replace with your model's real preprocessing.
# # #     """
# # #     # If no librosa available, mock
# # #     if not librosa:
# # #         return {"label": "mock", "score": 0.5}
# # #     try:
# # #         y, sr = librosa.load(path, sr=16000)
# # #         mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
# # #         feature = np.mean(mfcc.T, axis=0)
# # #         x = np.expand_dims(feature, axis=0)  # shape (1, n_mfcc)
# # #         if MODEL is not None:
# # #             # adapt to your model input shape as needed
# # #             preds = MODEL.predict(x)
# # #             # assume binary classification with sigmoid or single output
# # #             score = float(preds.ravel()[0])
# # #             label = "Abnormal" if score >= 0.5 else "Normal"
# # #             return {"label": label, "score": score}
# # #         else:
# # #             # mock prediction using simple heuristic
# # #             score = float(np.clip(np.mean(np.abs(feature)) / 50.0, 0, 1))
# # #             label = "Abnormal" if score >= 0.5 else "Normal"
# # #             return {"label": label, "score": score}
# # #     except Exception as e:
# # #         app.logger.exception("Error processing audio: %s", e)
# # #         return {"label": "error", "score": 0.0}

# # # # -------------------- Routes --------------------
# # # @app.route("/register", methods=["POST"])
# # # def register():
# # #     """
# # #     Body JSON: { name (optional), email, password, role }  (role: 'patient' or 'doctor')
# # #     Minimal registration allowed (only email+password+role required)
# # #     """
# # #     data = request.get_json() or {}
# # #     email = (data.get("email") or "").strip().lower()
# # #     password = data.get("password", "")
# # #     role = data.get("role", "")
# # #     name = data.get("name", None)

# # #     if not email or not password or role not in ("patient", "doctor"):
# # #         return jsonify({"message": "email, password, and role ('patient'|'doctor') are required"}), 400

# # #     if User.query.filter_by(email=email).first():
# # #         return jsonify({"message": "User with this email already exists"}), 409




# # #     # password_hash = bcrypt.hash(password)
# # #     password = password[:72]  # bcrypt supports max 72 bytes
# # #     password_hash = bcrypt.hash(password)






# # #     user = User(email=email, password_hash=password_hash, role=role, name=name)
# # #     db.session.add(user)
# # #     db.session.commit()

# # #     return jsonify({"message": "Registered successfully", "user_id": user.id}), 201

# # # @app.route("/login", methods=["POST"])
# # # def login():
# # #     """
# # #     Body JSON: { email, password }
# # #     Returns: access_token, role, profile_complete flag
# # #     """
# # #     data = request.get_json() or {}
# # #     email = (data.get("email") or "").strip().lower()
# # #     password = data.get("password", "")

# # #     user = User.query.filter_by(email=email).first()
# # #     if not user or not bcrypt.verify(password, user.password_hash):
# # #         return jsonify({"message": "Invalid credentials"}), 401

# # #     token = create_access_token(user.id)

# # #     # If profile incomplete, notify on first login
# # #     profile_complete = bool(user.profile_complete)

# # #     return jsonify({
# # #         "message": "Login successful",
# # #         "access_token": token,
# # #         "role": user.role,
# # #         "profile_complete": profile_complete,
# # #         "user": {
# # #             "id": user.id,
# # #             "name": user.name,
# # #             "email": user.email,
# # #         }
# # #     }), 200

# # # @app.route("/me", methods=["GET"])
# # # @auth_required()
# # # def me():
# # #     user = request.current_user
# # #     return jsonify({
# # #         "id": user.id,
# # #         "name": user.name,
# # #         "email": user.email,
# # #         "role": user.role,
# # #         "profile_complete": user.profile_complete,
# # #         "phone": user.phone,
# # #         "age": user.age,
# # #         "gender": user.gender,
# # #         "address": user.address,
# # #         "specialization": user.specialization
# # #     }), 200

# # # @app.route("/complete_profile", methods=["POST"])
# # # @auth_required()
# # # def complete_profile():
# # #     """
# # #     Body JSON: can include name, phone, age, gender, address, specialization (if doctor)
# # #     Marks profile_complete True.
# # #     """
# # #     user = request.current_user
# # #     data = request.get_json() or {}

# # #     # update allowed fields
# # #     for field in ("name", "phone", "age", "gender", "address", "specialization"):
# # #         if field in data:
# # #             setattr(user, field, data[field])

# # #     user.profile_complete = True
# # #     db.session.commit()
# # #     return jsonify({"message": "Profile updated", "profile_complete": True}), 200

# # # # -------------------- Patient: upload audio --------------------
# # # @app.route("/upload_audio", methods=["POST"])
# # # @auth_required(role="patient")
# # # def upload_audio():
# # #     """
# # #     Accepts multipart/form-data file (field name: 'file').
# # #     Returns prediction result and stores record.
# # #     """
# # #     if "file" not in request.files:
# # #         return jsonify({"message": "No file part 'file' in request"}), 400

# # #     f = request.files["file"]
# # #     if f.filename == "":
# # #         return jsonify({"message": "No file selected"}), 400

# # #     if not allowed_file(f.filename):
# # #         return jsonify({"message": "Unsupported file type"}), 400

# # #     filename = secure_filename(f"{uuid.uuid4().hex}_{f.filename}")
# # #     filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
# # #     f.save(filepath)

# # #     # run model / preprocessing
# # #     prediction = preprocess_audio_and_predict(filepath)
# # #     result_label = prediction.get("label", "unknown")

# # #     # save record
# # #     record = PatientRecord(patient_id=request.current_user.id, filename=filename, result=result_label)
# # #     db.session.add(record)
# # #     db.session.commit()

# # #     return jsonify({
# # #         "message": "File uploaded and processed",
# # #         "record": {
# # #             "id": record.id,
# # #             "filename": record.filename,
# # #             "result": record.result,
# # #             "created_at": record.created_at.isoformat()
# # #         },
# # #         "prediction": prediction
# # #     }), 200

# # # # -------------------- Patient: view own records --------------------
# # # @app.route("/my_records", methods=["GET"])
# # # @auth_required(role="patient")
# # # def my_records():
# # #     user = request.current_user
# # #     records = PatientRecord.query.filter_by(patient_id=user.id).order_by(PatientRecord.created_at.desc()).all()
# # #     out = [{
# # #         "id": r.id,
# # #         "filename": r.filename,
# # #         "result": r.result,
# # #         "created_at": r.created_at.isoformat()
# # #     } for r in records]
# # #     return jsonify({"records": out}), 200

# # # # -------------------- Patient: request connect to a doctor --------------------
# # # @app.route("/connect_doctor", methods=["POST"])
# # # @auth_required(role="patient")
# # # def connect_doctor():
# # #     """
# # #     Body: { doctor_id }
# # #     """
# # #     data = request.get_json() or {}
# # #     doctor_id = data.get("doctor_id")
# # #     if not doctor_id:
# # #         return jsonify({"message": "doctor_id is required"}), 400

# # #     doc = User.query.filter_by(id=doctor_id, role="doctor").first()
# # #     if not doc:
# # #         return jsonify({"message": "Doctor not found"}), 404

# # #     # create connection request (if not already)
# # #     existing = ConnectionRequest.query.filter_by(patient_id=request.current_user.id, doctor_id=doctor_id).first()
# # #     if existing:
# # #         return jsonify({"message": "Connection request already exists", "status": existing.status}), 200

# # #     conn = ConnectionRequest(patient_id=request.current_user.id, doctor_id=doctor_id, status="pending")
# # #     db.session.add(conn)
# # #     db.session.commit()

# # #     return jsonify({"message": "Connection request sent", "connection_id": conn.id}), 201

# # # # -------------------- Doctor: get patients who requested this doctor --------------------
# # # @app.route("/doctor/patients", methods=["GET"])
# # # @auth_required(role="doctor")
# # # def doctor_patients():
# # #     """
# # #     Returns list of connection requests for the logged-in doctor.
# # #     Each entry includes patient basic info and record(s) if any.
# # #     """
# # #     doc = request.current_user
# # #     conns = ConnectionRequest.query.filter_by(doctor_id=doc.id).order_by(ConnectionRequest.created_at.desc()).all()
# # #     result = []
# # #     for c in conns:
# # #         patient = User.query.get(c.patient_id)
# # #         if not patient:
# # #             continue
# # #         # fetch latest patient record if exists
# # #         latest_record = PatientRecord.query.filter_by(patient_id=patient.id).order_by(PatientRecord.created_at.desc()).first()
# # #         latest = None
# # #         if latest_record:
# # #             latest = {
# # #                 "id": latest_record.id,
# # #                 "filename": latest_record.filename,
# # #                 "result": latest_record.result,
# # #                 "created_at": latest_record.created_at.isoformat()
# # #             }
# # #         result.append({
# # #             "connection_id": c.id,
# # #             "status": c.status,
# # #             "requested_at": c.created_at.isoformat(),
# # #             "patient": {
# # #                 "id": patient.id,
# # #                 "name": patient.name,
# # #                 "email": patient.email,
# # #                 "phone": patient.phone,
# # #                 "age": patient.age,
# # #                 "gender": patient.gender,
# # #                 "address": patient.address
# # #             },
# # #             "latest_record": latest
# # #         })
# # #     return jsonify({"patients": result}), 200

# # # # -------------------- Doctor: accept/reject connection --------------------
# # # @app.route("/doctor/connection/<int:conn_id>", methods=["POST"])
# # # @auth_required(role="doctor")
# # # def update_connection(conn_id):
# # #     """
# # #     Body: { action: 'accept' | 'reject' }
# # #     """
# # #     data = request.get_json() or {}
# # #     action = data.get("action")
# # #     if action not in ("accept", "reject"):
# # #         return jsonify({"message": "action must be 'accept' or 'reject'"}), 400
# # #     conn = ConnectionRequest.query.get(conn_id)
# # #     if not conn or conn.doctor_id != request.current_user.id:
# # #         return jsonify({"message": "Connection not found"}), 404
# # #     conn.status = "accepted" if action == "accept" else "rejected"
# # #     db.session.commit()
# # #     return jsonify({"message": f"Connection {conn.status}"}), 200

# # # # -------------------- Simple admin / development helpers --------------------
# # # @app.route("/list_doctors", methods=["GET"])
# # # def list_doctors():
# # #     docs = User.query.filter_by(role="doctor").all()
# # #     out = [{"id": d.id, "name": d.name, "email": d.email, "specialization": d.specialization} for d in docs]
# # #     return jsonify({"doctors": out})

# # # # -------------------- Bootstrap DB --------------------
# # # @app.before_request
# # # def create_tables():
# # #     db.create_all()

# # # # -------------------- Run --------------------
# # # if __name__ == "__main__":
# # #     print("Starting Flask app...")
# # #     app.run(host="0.0.0.0", port=8000, debug=True)



# # from flask import Flask, request, jsonify
# # from flask_sqlalchemy import SQLAlchemy
# # from flask_cors import CORS
# # from werkzeug.utils import secure_filename
# # import torch
# # import torch.nn as nn
# # import os
# # import bcrypt
# # import uuid

# # app = Flask(__name__)
# # CORS(app)

# # # -------------------- CONFIG --------------------
# # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
# # app.config['UPLOAD_FOLDER'] = 'uploads'
# # os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# # db = SQLAlchemy(app)

# # # -------------------- DATABASE MODELS --------------------
# # class User(db.Model):
# #     id = db.Column(db.Integer, primary_key=True)
# #     role = db.Column(db.String(10))  # 'patient' or 'doctor'
# #     name = db.Column(db.String(100))
# #     email = db.Column(db.String(100), unique=True)
# #     password = db.Column(db.String(200))
# #     profile_completed = db.Column(db.Boolean, default=False)

# # class PatientProfile(db.Model):
# #     id = db.Column(db.Integer, primary_key=True)
# #     user_id = db.Column(db.Integer)
# #     age = db.Column(db.Integer)
# #     condition = db.Column(db.String(200))
# #     doctor_id = db.Column(db.Integer, nullable=True)
# #     audio_file = db.Column(db.String(200))
# #     model_output = db.Column(db.String(200))

# # class DoctorProfile(db.Model):
# #     id = db.Column(db.Integer, primary_key=True)
# #     user_id = db.Column(db.Integer)
# #     specialization = db.Column(db.String(200))
# #     experience = db.Column(db.Integer)

# # with app.app_context():
# #     db.create_all()

# # # -------------------- LOAD DL MODEL --------------------
# # class DummyModel(nn.Module):
# #     def __init__(self):
# #         super().__init__()
# #         self.fc = nn.Linear(10, 2)  # Example model
# #     def forward(self, x):
# #         return self.fc(x)

# # # Load your trained model here
# # model = DummyModel()
# # # model.load_state_dict(torch.load('model/rdlinet_model.pth', map_location='cpu'))
# # model.eval()

# # # -------------------- AUTH ROUTES --------------------
# # @app.route('/register', methods=['POST'])
# # def register():
# #     data = request.get_json()
# #     name = data.get('name')
# #     email = data.get('email')
# #     password = data.get('password')
# #     role = data.get('role')

# #     if User.query.filter_by(email=email).first():
# #         return jsonify({'error': 'Email already exists'}), 400

# #     hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
# #     new_user = User(name=name, email=email, password=hashed_pw, role=role)
# #     db.session.add(new_user)
# #     db.session.commit()

# #     return jsonify({'message': 'User registered successfully!'})

# # @app.route('/login', methods=['POST'])
# # def login():
# #     data = request.get_json()
# #     email = data.get('email')
# #     password = data.get('password')

# #     user = User.query.filter_by(email=email).first()
# #     if not user:
# #         return jsonify({'error': 'User not found'}), 404

# #     if bcrypt.checkpw(password.encode('utf-8'), user.password):
# #         return jsonify({
# #             'message': 'Login successful',
# #             'user': {
# #                 'id': user.id,
# #                 'role': user.role,
# #                 'name': user.name,
# #                 'profile_completed': user.profile_completed
# #             }
# #         })
# #     else:
# #         return jsonify({'error': 'Invalid credentials'}), 401

# # # -------------------- PROFILE COMPLETION --------------------
# # @app.route('/complete_profile', methods=['POST'])
# # def complete_profile():
# #     data = request.get_json()
# #     user_id = data.get('user_id')
# #     user = User.query.get(user_id)

# #     if not user:
# #         return jsonify({'error': 'User not found'}), 404

# #     if user.role == 'patient':
# #         profile = PatientProfile(user_id=user.id, age=data.get('age'), condition=data.get('condition'))
# #         db.session.add(profile)
# #     else:
# #         profile = DoctorProfile(user_id=user.id, specialization=data.get('specialization'), experience=data.get('experience'))
# #         db.session.add(profile)

# #     user.profile_completed = True
# #     db.session.commit()
# #     return jsonify({'message': 'Profile completed successfully'})

# # # -------------------- PATIENT AUDIO UPLOAD --------------------
# # @app.route('/upload_audio', methods=['POST'])
# # def upload_audio():
# #     user_id = request.form.get('user_id')
# #     file = request.files['file']

# #     if not file:
# #         return jsonify({'error': 'No file uploaded'}), 400

# #     filename = secure_filename(file.filename)
# #     filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
# #     file.save(filepath)

# #     # Simulate model prediction
# #     output = "Detected Condition: Normal"  # Replace with actual model inference
# #     # Example:
# #     # audio_tensor = preprocess_audio(filepath)
# #     # prediction = model(audio_tensor)
# #     # output = interpret(prediction)

# #     patient = PatientProfile.query.filter_by(user_id=user_id).first()
# #     if patient:
# #         patient.audio_file = filepath
# #         patient.model_output = output
# #         db.session.commit()

# #     return jsonify({'message': 'Audio processed', 'output': output})

# # # -------------------- DOCTOR VIEW PATIENTS --------------------
# # @app.route('/doctor_patients/<int:doctor_id>', methods=['GET'])
# # def doctor_patients(doctor_id):
# #     patients = PatientProfile.query.filter_by(doctor_id=doctor_id).all()
# #     result = []
# #     for p in patients:
# #         user = User.query.get(p.user_id)
# #         result.append({
# #             'patient_name': user.name,
# #             'condition': p.condition,
# #             'audio': p.audio_file,
# #             'model_output': p.model_output
# #         })
# #     return jsonify(result)

# # # -------------------- CONNECT TO DOCTOR --------------------
# # @app.route('/connect_doctor', methods=['POST'])
# # def connect_doctor():
# #     data = request.get_json()
# #     patient_id = data.get('patient_id')
# #     doctor_id = data.get('doctor_id')

# #     patient = PatientProfile.query.filter_by(user_id=patient_id).first()
# #     if not patient:
# #         return jsonify({'error': 'Patient not found'}), 404

# #     patient.doctor_id = doctor_id
# #     db.session.commit()
# #     return jsonify({'message': 'Connected to doctor successfully'})

# # # -------------------- RUN SERVER --------------------
# # if __name__ == '__main__':
# #     app.run(host='127.0.0.1', port=8000, debug=True)



# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# import torch
# import torch.nn as nn
# import os
# import bcrypt
# import uuid

# app = Flask(__name__)
# CORS(app)

# # -------------------- CONFIG --------------------
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
# app.config['UPLOAD_FOLDER'] = 'uploads'
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# db = SQLAlchemy(app)

# # -------------------- DATABASE MODELS --------------------
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     role = db.Column(db.String(10))  # 'patient' or 'doctor'
#     name = db.Column(db.String(100))
#     email = db.Column(db.String(100), unique=True)
#     password = db.Column(db.String(200))
#     profile_completed = db.Column(db.Boolean, default=False)

# class PatientProfile(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer)
#     age = db.Column(db.Integer)
#     condition = db.Column(db.String(200))
#     doctor_id = db.Column(db.Integer, nullable=True)
#     audio_file = db.Column(db.String(200))
#     model_output = db.Column(db.String(200))

# class DoctorProfile(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer)
#     specialization = db.Column(db.String(200))
#     experience = db.Column(db.Integer)

# with app.app_context():
#     db.create_all()

# # -------------------- LOAD DL MODEL --------------------
# class DummyModel(nn.Module):
#     def __init__(self):
#         super().__init__()
#         self.fc = nn.Linear(10, 2)  # Example model
#     def forward(self, x):
#         return self.fc(x)

# # Load your trained model here
# model = DummyModel()
# # model.load_state_dict(torch.load('model/rdlinet_model.pth', map_location='cpu'))
# model.eval()

# # -------------------- AUTH ROUTES --------------------
# @app.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     name = data.get('name')
#     email = data.get('email')
#     password = data.get('password')
#     role = data.get('role')

#     if User.query.filter_by(email=email).first():
#         return jsonify({'error': 'Email already exists'}), 400

#     hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
#     new_user = User(name=name, email=email, password=hashed_pw, role=role)
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({'message': 'User registered successfully!'})

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     user = User.query.filter_by(email=email).first()
#     if not user:
#         return jsonify({'error': 'User not found'}), 404

#     if bcrypt.checkpw(password.encode('utf-8'), user.password):
#         return jsonify({
#             'message': 'Login successful',
#             'user': {
#                 'id': user.id,
#                 'role': user.role,
#                 'name': user.name,
#                 'profile_completed': user.profile_completed
#             }
#         })
#     else:
#         return jsonify({'error': 'Invalid credentials'}), 401

# # -------------------- PROFILE COMPLETION --------------------
# @app.route('/complete_profile', methods=['POST'])
# def complete_profile():
#     data = request.get_json()
#     user_id = data.get('user_id')
#     user = User.query.get(user_id) 

#     if not user:
#         return jsonify({'error': 'User not found'}), 404

#     if user.role == 'patient':
#         profile = PatientProfile(user_id=user.id, age=data.get('age'), condition=data.get('condition'))
#         db.session.add(profile)
#     else:
#         profile = DoctorProfile(user_id=user.id, specialization=data.get('specialization'), experience=data.get('experience'))
#         db.session.add(profile)

#     user.profile_completed = True
#     db.session.commit()
#     return jsonify({'message': 'Profile completed successfully'})

# # -------------------- PATIENT AUDIO UPLOAD --------------------
# @app.route('/upload_audio', methods=['POST'])
# def upload_audio():
#     user_id = request.form.get('user_id')
#     file = request.files['file']

#     if not file:
#         return jsonify({'error': 'No file uploaded'}), 400

#     filename = secure_filename(file.filename)
#     filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     file.save(filepath)

#     # Simulate model prediction
#     output = "Detected Condition: Normal"  # Replace with actual model inference
#     # Example:
#     # audio_tensor = preprocess_audio(filepath)
#     # prediction = model(audio_tensor)
#     # output = interpret(prediction)

#     patient = PatientProfile.query.filter_by(user_id=user_id).first()
#     if patient:
#         patient.audio_file = filepath
#         patient.model_output = output
#         db.session.commit()

#     return jsonify({'message': 'Audio processed', 'output': output})

# # -------------------- DOCTOR VIEW PATIENTS --------------------
# @app.route('/doctor_patients/<int:doctor_id>', methods=['GET'])
# def doctor_patients(doctor_id):
#     patients = PatientProfile.query.filter_by(doctor_id=doctor_id).all()
#     result = []
#     for p in patients:
#         user = User.query.get(p.user_id)
#         result.append({
#             'patient_name': user.name,
#             'condition': p.condition,
#             'audio': p.audio_file,
#             'model_output': p.model_output
#         })
#     return jsonify(result)

# # -------------------- CONNECT TO DOCTOR --------------------
# @app.route('/connect_doctor', methods=['POST'])
# def connect_doctor():
#     data = request.get_json()
#     patient_id = data.get('patient_id')
#     doctor_id = data.get('doctor_id')

#     patient = PatientProfile.query.filter_by(user_id=patient_id).first()
#     if not patient:
#         return jsonify({'error': 'Patient not found'}), 404

#     patient.doctor_id = doctor_id
#     db.session.commit()
#     return jsonify({'message': 'Connected to doctor successfully'})

# # -------------------- RUN SERVER --------------------
# if __name__ == '__main__':
#     app.run(host='127.0.0.1', port=8000, debug=True)













# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# import torch
# import torch.nn as nn
# import bcrypt
# import os

# app = Flask(__name__)
# CORS(app)

# # ---------------- CONFIG ----------------
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
# app.config['UPLOAD_FOLDER'] = 'uploads'
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
# db = SQLAlchemy(app)

# # ---------------- DATABASE MODELS ----------------
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     role = db.Column(db.String(10))  # patient / doctor
#     name = db.Column(db.String(100))
#     email = db.Column(db.String(100), unique=True)
#     password = db.Column(db.String(200))
#     profile_completed = db.Column(db.Boolean, default=False)

# class PatientProfile(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer)
#     age = db.Column(db.Integer)
#     condition = db.Column(db.String(200))
#     doctor_id = db.Column(db.Integer, nullable=True)
#     audio_file = db.Column(db.String(200))
#     model_output = db.Column(db.String(200))

# class DoctorProfile(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer)
#     specialization = db.Column(db.String(200))
#     experience = db.Column(db.Integer)

# with app.app_context():
#     db.create_all()

# # ---------------- LOAD DL MODEL ----------------
# class DummyModel(nn.Module):
#     def __init__(self):
#         super().__init__()
#         self.fc = nn.Linear(10, 2)  # Example model
#     def forward(self, x):
#         return self.fc(x)

# model = DummyModel()
# # model.load_state_dict(torch.load('model/rdlinet_model.pth', map_location='cpu'))
# model.eval()

# # ---------------- REGISTER ----------------
# @app.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     name = data.get('name')
#     email = data.get('email')
#     password = data.get('password')
#     role = data.get('role')

#     if User.query.filter_by(email=email).first():
#         return jsonify({'error': 'Email already registered'}), 400

#     hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
#     new_user = User(name=name, email=email, password=hashed_pw, role=role)
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({'message': 'Registration successful. Please login.'}), 201

# # ---------------- LOGIN ----------------
# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')
#     role = data.get('role')  # <-- ✅ capture role from frontend

#     # ✅ Match both email and role
#     user = User.query.filter_by(email=email, role=role).first()
#     if not user:
#         return jsonify({'error': 'User not found for this role'}), 404

#     if bcrypt.checkpw(password.encode('utf-8'), user.password):
#         return jsonify({
#             'message': 'Login successful',
#             'user': {
#                 'id': user.id,
#                 'name': user.name,
#                 'role': user.role,
#                 'profile_completed': user.profile_completed
#             }
#         }), 200
#     else:
#         return jsonify({'error': 'Invalid credentials'}), 401

# # ---------------- COMPLETE PROFILE ----------------
# @app.route('/complete_profile', methods=['POST'])
# def complete_profile():
#     data = request.get_json()
#     user_id = data.get('user_id')
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({'error': 'User not found'}), 404

#     if user.role == 'patient':
#         profile = PatientProfile(
#             user_id=user.id,
#             age=data.get('age'),
#             condition=data.get('condition')
#         )
#         db.session.add(profile)
#     else:
#         profile = DoctorProfile(
#             user_id=user.id,
#             specialization=data.get('specialization'),
#             experience=data.get('experience')
#         )
#         db.session.add(profile)

#     user.profile_completed = True
#     db.session.commit()
#     return jsonify({'message': 'Profile completed successfully'}), 200

# # ---------------- PATIENT AUDIO UPLOAD ----------------
# @app.route('/upload_audio', methods=['POST'])
# def upload_audio():
#     user_id = request.form.get('user_id')
#     file = request.files.get('file')

#     if not file:
#         return jsonify({'error': 'No file uploaded'}), 400

#     filename = secure_filename(file.filename)
#     filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     file.save(filepath)

#     # 🔹 Dummy Model Output
#     output = "Detected Condition: Normal"  # Replace with model inference later

#     patient = PatientProfile.query.filter_by(user_id=user_id).first()
#     if patient:
#         patient.audio_file = filepath
#         patient.model_output = output
#         db.session.commit()

#     return jsonify({'message': 'Audio uploaded successfully', 'output': output}), 200

# # ---------------- CONNECT TO DOCTOR ----------------
# @app.route('/connect_doctor', methods=['POST'])
# def connect_doctor():
#     data = request.get_json()
#     patient_id = data.get('patient_id')
#     doctor_id = data.get('doctor_id')

#     patient = PatientProfile.query.filter_by(user_id=patient_id).first()
#     if not patient:
#         return jsonify({'error': 'Patient not found'}), 404

#     patient.doctor_id = doctor_id
#     db.session.commit()
#     return jsonify({'message': 'Connected to doctor successfully'}), 200

# # ---------------- USER PROFILE ----------------
# @app.route('/profile/<int:user_id>', methods=['GET'])
# def get_profile(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({'error': 'User not found'}), 404

#     profile_data = {}
#     if user.role == 'doctor':
#         profile = DoctorProfile.query.filter_by(user_id=user_id).first()
#         if profile:
#             profile_data = {
#                 'specialization': profile.specialization,
#                 'experience': profile.experience
#             }
#     elif user.role == 'patient':
#         profile = PatientProfile.query.filter_by(user_id=user_id).first()
#         if profile:
#             profile_data = {
#                 'age': profile.age,
#                 'condition': profile.condition,
#                 'doctor_id': profile.doctor_id,
#                 'model_output': profile.model_output
#             }

#     return jsonify({
#         'id': user.id,
#         'name': user.name,
#         'email': user.email,
#         'role': user.role,
#         **profile_data
#     }), 200


# # ---------------- DOCTOR VIEW PATIENTS ----------------
# @app.route('/doctor_patients/<int:doctor_id>', methods=['GET'])
# def doctor_patients(doctor_id):
#     patients = PatientProfile.query.filter_by(doctor_id=doctor_id).all()
#     result = []
#     for p in patients:
#         user = User.query.get(p.user_id)
#         result.append({
#             'patient_id': user.id,
#             'name': user.name,
#             'age': p.age,
#             'condition': p.condition,
#             'audio': p.audio_file,
#             'model_output': p.model_output
#         })
#     return jsonify(result), 200

# # ---------------- RUN ----------------
# if __name__ == '__main__':
#     app.run(host='127.0.0.1', port=8000, debug=True)






# app.py
# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# import bcrypt
# import numpy as np
# import os
# import librosa
# from datetime import datetime, time, timedelta
# from tensorflow.keras.models import load_model
# from flask_socketio import SocketIO, emit, join_room, leave_room
# from datetime import datetime




# # ---------------- APP CONFIG ----------------
# app = Flask(__name__)
# CORS(app)

# socketio = SocketIO(app, cors_allowed_origins="*")

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:%40Sahithi89@localhost/rhms'
# app.config['UPLOAD_FOLDER'] = 'uploads'
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)

# # ---------------- DATABASE MODELS ----------------
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     role = db.Column(db.String(10))  # patient / doctor
#     name = db.Column(db.String(100))
#     email = db.Column(db.String(100), unique=True)
#     password = db.Column(db.LargeBinary(200))
#     profile_completed = db.Column(db.Boolean, default=False)

# class PatientProfile(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, unique=True)
#     age = db.Column(db.Integer)
#     condition = db.Column(db.String(200))
#     doctor_id = db.Column(db.Integer, nullable=True)            # current connected doctor (if any)
#     previous_doctor_id = db.Column(db.Integer, nullable=True)   # regular / previous doctor
#     urgent = db.Column(db.Boolean, default=False)
#     audio_file = db.Column(db.String(200))
#     model_output = db.Column(db.String(200))

# class DoctorProfile(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, unique=True)
#     specialization = db.Column(db.String(200))
#     experience = db.Column(db.Integer)
#     # Availability stored as HH:MM strings (24h). Use complete_profile to set.
#     available_from = db.Column(db.Time)
#     available_to = db.Column(db.Time)
#     max_patients = db.Column(db.Integer, default=5)
#     current_patients = db.Column(db.Integer, default=0)
#     status = db.Column(db.String(20), default="Available")  # Available / Unavailable

# class Appointment(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     doctor_id = db.Column(db.Integer)
#     patient_id = db.Column(db.Integer)
#     status = db.Column(db.String(20), default="Pending")  # Pending / Active / Completed
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# class ChatMessage(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'), nullable=False)
#     sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     message = db.Column(db.Text, nullable=False)
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# with app.app_context():
#     db.create_all()

# # ---------------- LOAD DL MODEL ----------------
# MODEL_PATH = "model/model.keras"
# # load_model may fail if model path missing - keep try/except if needed
# model = load_model(MODEL_PATH)
# print("✅ Keras model loaded successfully!")

# # ---------------- HELPERS ----------------
# def parse_time_hhmm(s):
#     """Parse "HH:MM" into a time object. Return None if invalid/None."""
#     if not s:
#         return None
#     try:
#         return datetime.strptime(s, "%H:%M").time()
#     except Exception:
#         return None

# def doctor_is_connectable_now(doc_profile):
#     """
#     Returns True if current time is within [available_from - 1hour, available_to].
#     If doc has no availability set, returns False.
#     """
#     start = parse_time_hhmm(doc_profile.available_from)
#     end = parse_time_hhmm(doc_profile.available_to)
#     if not start or not end:
#         return False
#     now = datetime.now().time()
#     # compute start_allowed = start - 1 hour
#     # because time objects don't support subtraction directly, use datetime combine
#     today = datetime.today()
#     start_dt = datetime.combine(today, start) - timedelta(hours=1)
#     end_dt = datetime.combine(today, end)
#     now_dt = datetime.combine(today, now)
#     return start_dt <= now_dt <= end_dt and doc_profile.status == "Available"

# # ---------------- REGISTER ----------------
# @app.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     name = data.get('name')
#     email = data.get('email')
#     password = data.get('password')
#     role = data.get('role')

#     if User.query.filter_by(email=email).first():
#         return jsonify({'error': 'Email already registered'}), 400

#     hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
#     new_user = User(name=name, email=email, password=hashed_pw, role=role)
#     db.session.add(new_user)
#     db.session.commit()

#     # create role-specific profile record
#     if role == 'patient':
#         profile = PatientProfile(user_id=new_user.id,
#                                  age=data.get('age'),
#                                  condition=data.get('condition'))
#         db.session.add(profile)
#     else:  # doctor
#         profile = DoctorProfile(
#             user_id=new_user.id,
#             specialization=data.get('specialization'),
#             experience=data.get('experience'),
#             available_from=data.get('available_from'),  # expect "HH:MM"
#             available_to=data.get('available_to'),      # expect "HH:MM"
#             max_patients=data.get('max_patients', 5)
#         )
#         db.session.add(profile)

#     new_user.profile_completed = True
#     db.session.commit()

#     return jsonify({'message': 'Registration successful. Please login.'}), 201

# # ---------------- LOGIN ----------------
# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')
#     role = data.get('role')

#     user = User.query.filter_by(email=email, role=role).first()
#     if not user:
#         return jsonify({'error': 'User not found for this role'}), 404

#     if bcrypt.checkpw(password.encode('utf-8'), user.password):
#         return jsonify({
#             'message': 'Login successful',
#             'user': {
#                 'id': user.id,
#                 'name': user.name,
#                 'role': user.role,
#                 'profile_completed': user.profile_completed
#             }
#         }), 200
#     else:
#         return jsonify({'error': 'Invalid credentials'}), 401

# # ---------------- COMPLETE PROFILE (update availability) ----------------
# @app.route('/complete_profile', methods=['POST'])
# def complete_profile():
#     data = request.get_json()
#     user_id = data.get('user_id')
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({'error': 'User not found'}), 404

#     if user.role == 'patient':
#         profile = PatientProfile.query.filter_by(user_id=user.id).first()
#         if not profile:
#             profile = PatientProfile(user_id=user.id)
#             db.session.add(profile)
#         profile.age = data.get('age')
#         profile.condition = data.get('condition')
#     else:
#         profile = DoctorProfile.query.filter_by(user_id=user.id).first()
#         if not profile:
#             profile = DoctorProfile(user_id=user.id)
#             db.session.add(profile)
#         profile.specialization = data.get('specialization')
#         profile.experience = data.get('experience')
#         # expect times as "HH:MM"
#         profile.available_from = data.get('available_from')
#         profile.available_to = data.get('available_to')
#         profile.max_patients = data.get('max_patients', profile.max_patients)

#     user.profile_completed = True
#     db.session.commit()
#     return jsonify({'message': 'Profile completed successfully'}), 200

# # ---------------- UPLOAD AUDIO (unchanged) ----------------
# @app.route('/upload_audio', methods=['POST'])
# def upload_audio():
#     user_id = request.form.get('user_id')
#     file = request.files.get('file')

#     if not file:
#         return jsonify({'error': 'No file uploaded'}), 400

#     filename = secure_filename(file.filename)
#     filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     file.save(filepath)

#     try:
#         y, sr = librosa.load(filepath, sr=16000)
#         mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=64)
#         mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)

#         if mel_spec_db.shape[1] < 38:
#             pad_width = 38 - mel_spec_db.shape[1]
#             mel_spec_db = np.pad(mel_spec_db, ((0, 0), (0, pad_width)), mode='constant')
#         else:
#             mel_spec_db = mel_spec_db[:, :38]

#         mel_spec_db = (mel_spec_db - np.min(mel_spec_db)) / (np.max(mel_spec_db) - np.min(mel_spec_db))
#         input_data = np.stack([mel_spec_db] * 3, axis=-1)
#         input_data = np.expand_dims(input_data, axis=0)

#         prediction = model.predict(input_data)
#         predicted_class = np.argmax(prediction, axis=1)[0]

#         label_map = {
#             0: "Asthma",
#             1: "Broncheostasis",
#             2: "Bronchiolitis",
#             3: "COPD",
#             4: "Healthy",
#             5: "Pneumonia",
#             6: "URTI"
#         }
#         output = label_map.get(predicted_class, "Unknown")

#     except Exception as e:
#         output = f"Error during model prediction: {str(e)}"

#     patient = PatientProfile.query.filter_by(user_id=user_id).first()
#     if patient:
#         patient.audio_file = filepath
#         patient.model_output = output
#         db.session.commit()

#     return jsonify({'message': 'Audio uploaded successfully', 'prediction': output}), 200

# # ---------------- LIST DOCTORS FOR PATIENT ----------------
# @app.route('/available_doctors_for_patient/<int:patient_user_id>', methods=['GET'])
# def available_doctors_for_patient(patient_user_id):
#     """
#     Returns list of doctors for the patient to choose from:
#      - includes patient's previous doctor (if any) first (with availability info)
#      - then list of other doctors who are connectable now (one hour before available_from through available_to),
#        sorted by current_patients ascending (lowest workload first)
#     """
#     # fetch patient profile
#     patient = PatientProfile.query.filter_by(user_id=patient_user_id).first()
#     if not patient:
#         return jsonify({'error': 'Patient not found'}), 404

#     result = []

#     # 1) include previous doctor if exists
#     if patient.previous_doctor_id:
#         prev_doc = DoctorProfile.query.get(patient.previous_doctor_id)
#         if prev_doc:
#             user = User.query.get(prev_doc.user_id)
#             result.append({
#                 'doctor_id': prev_doc.id,
#                 'user_id': prev_doc.user_id,
#                 'name': user.name if user else None,
#                 'specialization': prev_doc.specialization,
#                 'available_from': prev_doc.available_from,
#                 'available_to': prev_doc.available_to,
#                 'current_patients': prev_doc.current_patients,
#                 'max_patients': prev_doc.max_patients,
#                 'status': prev_doc.status,
#                 'is_regular': True,
#                 'connectable_now': doctor_is_connectable_now(prev_doc)
#             })

#     # 2) other available doctors (connectable now) sorted by current_patients asc
#     all_docs = DoctorProfile.query.filter(DoctorProfile.status == "Available").all()
#     connectable = []
#     for d in all_docs:
#         # skip previous doc duplicate
#         if patient.previous_doctor_id and d.id == patient.previous_doctor_id:
#             continue
#         if doctor_is_connectable_now(d):
#             user = User.query.get(d.user_id)
#             connectable.append({
#                 'doctor_id': d.id,
#                 'user_id': d.user_id,
#                 'name': user.name if user else None,
#                 'specialization': d.specialization,
#                 'available_from': d.available_from,
#                 'available_to': d.available_to,
#                 'current_patients': d.current_patients,
#                 'max_patients': d.max_patients,
#                 'status': d.status,
#                 'is_regular': False,
#                 'connectable_now': True
#             })
#     # sort by workload (current_patients)
#     connectable_sorted = sorted(connectable, key=lambda x: x['current_patients'])
#     result.extend(connectable_sorted)

#     return jsonify({'doctors': result}), 200

# # ---------------- CONNECT TO DOCTOR ----------------
# @app.route('/connect_doctor', methods=['POST'])
# def connect_doctor():
#     data = request.get_json()
#     patient_id = data.get('patient_id')  or data.get('user_id')
#     doctor_id = data.get('doctor_id')
#     urgent = data.get('urgent', False)

#     # ✅ Try both PatientProfile.id and PatientProfile.user_id
#     patient = PatientProfile.query.filter(
#         (PatientProfile.id == patient_id) | (PatientProfile.user_id == patient_id)
#     ).first()

#     if not patient:
#         return jsonify({"error": "Patient not found"}), 404

#     if urgent:
#         # 🔍 Find least busy available doctor
#         available_doctor = (
#             DoctorProfile.query.filter_by(status="Available")
#             .order_by(DoctorProfile.current_patients.asc())
#             .first()
#         )

#         if available_doctor:
#             available_doctor.current_patients += 1
#             patient.previous_doctor_id = available_doctor.id
#             # ✅ Create appointment record
#             new_appointment = Appointment(
#                 doctor_id=available_doctor.user_id,
#                 patient_id=patient.user_id,
#                 status="Active"
#             )
#             db.session.add(new_appointment)
#             db.session.commit()
#             return jsonify({
#                 "message": "Connected to available doctor",
#                 "doctor": User.query.get(available_doctor.user_id).name,
#                 "appointment_id": new_appointment.id
#             }), 200
#         else:
#             return jsonify({"error": "No available doctors"}), 404

#     else:
#         # 👩‍⚕️ Connect to specific/regular doctor
#         if doctor_id:
#             doctor = DoctorProfile.query.get(doctor_id)
#             if doctor:
#                 doctor.current_patients += 1
#                 patient.previous_doctor_id = doctor.id

#                  # ✅ Create appointment record
#                 new_appointment = Appointment(
#                     doctor_id=doctor.user_id,
#                     patient_id=patient.user_id,
#                     status="Active"
#                 )
#                 db.session.add(new_appointment)
#                 db.session.commit()
#                 return jsonify({
#                     "message": "Connected to your regular doctor",
#                     "doctor": User.query.get(doctor.user_id).name,
#                     "appointment_id": new_appointment.id
#                 }), 200
#             else:
#                 return jsonify({"error": "Doctor not found"}), 404
#         else:
#             return jsonify({"error": "No doctor specified"}), 400

# # ---------------- DOCTOR VIEW PATIENTS (unchanged) ----------------
# # @app.route('/doctor_patients/<int:doctor_user_id>', methods=['GET'])
# # def doctor_patients(doctor_user_id):
# #     # find all appointments where doctor_id == doctor_user_id
# #     appointments = Appointment.query.filter_by(doctor_id=doctor_user_id).all()
# #     result = []
# #     for appt in appointments:
# #         # appt.patient_id holds patient user_id
# #         patient_profile = PatientProfile.query.filter_by(user_id=appt.patient_id).first()
# #         patient_user = User.query.get(appt.patient_id)
# #         if patient_profile and patient_user:
# #             result.append({
# #                 'patient_id': patient_user.id,
# #                 'name': patient_user.name,
# #                 'age': patient_profile.age,
# #                 'condition': patient_profile.condition,
# #                 'audio': patient_profile.audio_file,
# #                 'model_output': patient_profile.model_output,
# #                 'status': appt.status,
# #                 'timestamp': appt.timestamp
# #             })
# #     return jsonify(result), 200
# @app.route('/doctor/appointments/<int:doctor_id>', methods=['GET'])
# def get_doctor_appointments(doctor_id):
#     appointments = Appointment.query.filter_by(doctor_id=doctor_id, status="Active").all()
#     data = [
#         {
#             "appointment_id": a.id,
#             "patient_id": a.patient_id,
#             "status": a.status
#         } for a in appointments
#     ]
#     return jsonify(data)


# # ---------------- USER PROFILE (unchanged) ----------------
# @app.route('/profile/<int:user_id>', methods=['GET'])
# def get_profile(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({'error': 'User not found'}), 404

#     profile_data = {}
#     if user.role == 'doctor':
#         profile = DoctorProfile.query.filter_by(user_id=user_id).first()
#         if profile:
#             profile_data = {
#                 'specialization': profile.specialization,
#                 'experience': profile.experience,
#                 'available_from': profile.available_from,
#                 'available_to': profile.available_to,
#                 'max_patients': profile.max_patients,
#                 'current_patients': profile.current_patients,
#                 'status': profile.status
#             }
#     elif user.role == 'patient':
#         profile = PatientProfile.query.filter_by(user_id=user_id).first()
#         if profile:
#             profile_data = {
#                 'age': profile.age,
#                 'condition': profile.condition,
#                 'doctor_id': profile.doctor_id,
#                 'previous_doctor_id': profile.previous_doctor_id,
#                 'model_output': profile.model_output
#             }

#     return jsonify({
#         'id': user.id,
#         'name': user.name,
#         'email': user.email,
#         'role': user.role,
#         **profile_data
#     }), 200


# @socketio.on('join')
# def handle_join(data):
#     appointment_id = str(data.get('appointment_id'))
#     user_name = data.get('user_name', 'Unknown')
#     room = f"chat_{appointment_id}"

#     print("🔔 JOIN request received:", {
#         "appointment_id": appointment_id,
#         "user_name": user_name,
#         "socket_sid": request.sid
#     })
#     join_room(room)
#     # print(f"✅ {user_name} joined room {appointment_id}")
#     print(f"✅ Joined room on server: room={room} sid={request.sid} user_name={user_name}")
#     emit('system_message', {'message': f"{user_name} joined the chat."}, room=room)


# @socketio.on('send_message')
# def handle_send_message(data):
#     appointment_id = str(data.get('appointment_id'))
#     sender_id = data.get('sender_id')
#     message = data.get('message')
#     room = f"chat_{appointment_id}"

#     print("📨 send_message incoming:", {
#         "appointment_id": appointment_id,
#         "sender_id": sender_id,
#         "message": message,
#         "socket_sid": request.sid
#     })
#     # (store message if you want)
#     emit('receive_message', {
#         'sender_id': sender_id,
#         'message': message,
#         'timestamp': datetime.utcnow().isoformat()
#     }, room=room)
#     print(f"🔊 Emitted receive_message to room={room}")

#     # store message
#     chat_msg = ChatMessage(
#         appointment_id=appointment_id,
#         sender_id=sender_id,
#         message=message
#     )
#     db.session.add(chat_msg)
#     db.session.commit()

#     # broadcast to everyone in the same room
#     emit('receive_message', {
#         'sender_id': sender_id,
#         'message': message,
#         'timestamp': datetime.utcnow().isoformat()
#     }, room=room)



# # ---------------- RUN ----------------
# # if __name__ == '__main__':
# #     socketio.run(app,host='127.0.0.1', port=8000, debug=True)

# if __name__ == '__main__':
#     import eventlet
#     import eventlet.wsgi
#     eventlet.monkey_patch()
#     socketio.run(app, host='127.0.0.1', port=8000, debug=True, allow_unsafe_werkzeug=True)





from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_socketio import SocketIO, emit, join_room
import bcrypt
import numpy as np
import os
import librosa
from datetime import datetime, timedelta
from tensorflow.keras.models import load_model

# ---------------- APP CONFIG ----------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

socketio = SocketIO(app, cors_allowed_origins="*")

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:%40Sahithi89@localhost/rhms'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

# ---------------- DATABASE MODELS ----------------

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20))
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.LargeBinary(200))

class PatientProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    age = db.Column(db.Integer)
    condition = db.Column(db.String(200))
    model_output = db.Column(db.String(200))

class DoctorProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    specialization = db.Column(db.String(200))
    experience = db.Column(db.Integer)
    available_from = db.Column(db.Time)
    available_to = db.Column(db.Time)
    status = db.Column(db.String(20), default="Available")

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String(20), default="Active")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Diagnosis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'))
    disease = db.Column(db.String(200))
    prescription = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# ---------------- LOAD MODEL ----------------
MODEL_PATH = "model/model.keras"
model = load_model(MODEL_PATH)

# ---------------- REGISTER ----------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    hashed_pw = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt())

    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_pw,
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()

    if user.role == "patient":
        profile = PatientProfile(
            user_id=user.id,
            age=data.get("age"),
        )
    else:
        profile = DoctorProfile(
            user_id=user.id,
            specialization=data.get("specialization"),
            available_from=datetime.strptime(data.get("available_from"), "%H:%M").time(),
            available_to=datetime.strptime(data.get("available_to"), "%H:%M").time()
        )

    db.session.add(profile)
    db.session.commit()

    return jsonify({'message': 'Registered successfully'}), 201

# ---------------- LOGIN ----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], role=data['role']).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if bcrypt.checkpw(data['password'].encode(), user.password):
        return jsonify({
            "id": user.id,
            "name": user.name,
            "role": user.role
        })
    return jsonify({'error': 'Invalid password'}), 401

# ---------------- AUDIO UPLOAD ----------------
@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    user_id = request.form.get('user_id')
    file = request.files.get('file')

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
    file.save(filepath)

    y, sr = librosa.load(filepath, sr=16000)
    mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=64)
    mel_db = librosa.power_to_db(mel, ref=np.max)

    mel_db = mel_db[:, :38]
    mel_db = (mel_db - np.min(mel_db)) / (np.max(mel_db) - np.min(mel_db))
    input_data = np.expand_dims(np.stack([mel_db]*3, axis=-1), axis=0)

    prediction = model.predict(input_data)
    predicted_class = np.argmax(prediction)

    labels = {
        0: "Asthma",
        1: "Broncheostasis",
        2: "Bronchiolitis",
        3: "COPD",
        4: "Healthy",
        5: "Pneumonia",
        6: "URTI"
    }

    result = labels.get(predicted_class)

    patient = PatientProfile.query.filter_by(user_id=user_id).first()
    patient.model_output = result
    db.session.commit()

    return jsonify({'prediction': result})

# ---------------- AVAILABLE DOCTORS ----------------
@app.route('/available_doctors/<int:patient_id>')
def available_doctors(patient_id):
    patient = PatientProfile.query.filter_by(user_id=patient_id).first()

    if patient.model_output == "Healthy":
        return jsonify({'message': 'No doctor required'})

    now = datetime.now().time()
    doctors = DoctorProfile.query.filter(
        DoctorProfile.available_from <= now,
        DoctorProfile.available_to >= now,
        DoctorProfile.status == "Available"
    ).all()

    result = []
    for d in doctors:
        user = User.query.get(d.user_id)
        result.append({
            "doctor_user_id": d.user_id,
            "name": user.name,
            "specialization": d.specialization
        })

    return jsonify(result)

# ---------------- CONNECT ----------------
@app.route('/connect', methods=['POST'])
def connect():
    data = request.json
    appointment = Appointment(
        doctor_id=data['doctor_id'],
        patient_id=data['patient_id']
    )
    db.session.add(appointment)
    db.session.commit()

    return jsonify({'appointment_id': appointment.id})



#-------------------APPOINTMENTS---------------------
@app.route('/doctor/appointments/<int:doctor_id>')
def doctor_appointments(doctor_id):
    appointments = Appointment.query.filter_by(
        doctor_id=doctor_id,
        status="Active"
    ).all()

    result = []

    for apt in appointments:
        patient_user = User.query.get(apt.patient_id)
        patient_profile = PatientProfile.query.filter_by(
            user_id=apt.patient_id
        ).first()

        result.append({
            "appointment_id": apt.id,
            "patient_id": apt.patient_id,
            "name": patient_user.name,
            "age": patient_profile.age if patient_profile else None,
            "condition": patient_profile.condition if patient_profile else None,
            "model_output": patient_profile.model_output if patient_profile else None
        })

    return jsonify(result)


# ---------------- CHAT ----------------
@socketio.on('join')
def join(data):
    room = f"chat_{data['appointment_id']}"
    join_room(room)

@socketio.on('send_message')
def send_message(data):
    room = f"chat_{data['appointment_id']}"

    msg = ChatMessage(
        appointment_id=data['appointment_id'],
        sender_id=data['sender_id'],
        message=data['message']
    )
    db.session.add(msg)
    db.session.commit()

    emit('receive_message', {
        'sender_id': data['sender_id'],
        'message': data['message'],
        'timestamp': datetime.utcnow().isoformat()
    }, room=room)

# ---------------- COMPLETE CONSULTATION ----------------
@app.route('/complete_consultation', methods=['POST'])
def complete_consultation():
    data = request.json

    diagnosis = Diagnosis(
        appointment_id=data['appointment_id'],
        disease=data['disease'],
        prescription=data['prescription'],
        notes=data.get('notes')
    )
    db.session.add(diagnosis)

    appointment = Appointment.query.get(data['appointment_id'])
    appointment.status = "Completed"

    db.session.commit()

    return jsonify({'message': 'Consultation completed and diagnosis saved'})

# ---------------- RUN ----------------
if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=8000, debug=True)
