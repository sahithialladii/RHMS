
import eventlet
eventlet.monkey_patch()


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
import pymysql
pymysql.install_as_MySQLdb()

# ---------------- APP CONFIG ----------------
app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app, cors_allowed_origins="*")

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:%40Sahithi89@localhost/rhms'
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.getenv('MYSQLUSER')}:"
    f"{os.getenv('MYSQLPASSWORD')}@"
    f"{os.getenv('MYSQLHOST')}:"
    f"{os.getenv('MYSQLPORT')}/"
    f"{os.getenv('MYSQLDATABASE')}"
)
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
    previous_history = db.Column(db.Text)
    medical_reports = db.Column(db.Text)

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






#-------------------------------------------------
@app.route('/')
def home():
    return {
        "status": "success",
        "message": "RHMS Backend Running"
    }
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

# ---------------------PATIENT PROFILE---------------------------
@app.route('/profile/<int:user_id>')
def get_profile(user_id):
    user = User.query.get(user_id)
    profile = PatientProfile.query.filter_by(user_id=user_id).first()

    if not user or not profile:
        return jsonify({'error': 'User not found'}), 404

    # Get completed consultations
    appointments = Appointment.query.filter_by(
        patient_id=user_id,
        status="Completed"
    ).all()

    diagnoses = []
    for apt in appointments:
        diagnosis = Diagnosis.query.filter_by(
            appointment_id=apt.id
        ).first()

        if diagnosis:
            diagnoses.append({
                "disease": diagnosis.disease,
                "prescription": diagnosis.prescription,
                "notes": diagnosis.notes,
                "date": apt.created_at.strftime("%Y-%m-%d")
            })

    return jsonify({
        "name": user.name,
        "email": user.email,
        "age": profile.age,
        # "gender": profile.gender,
        "model_output": profile.model_output,
        "condition": profile.condition,
        "previous_history": profile.previous_history,
        "medical_reports": profile.medical_reports,
        "diagnosis_history": diagnoses
    })

# --------------------UPDATE PATIENT PROFILE-------------------
@app.route('/profile/update', methods=['PUT'])
def update_profile():
    data = request.json
    user_id = data['user_id']

    user = User.query.get(user_id)
    profile = PatientProfile.query.filter_by(user_id=user_id).first()

    user.name = data.get("name", user.name)
    profile.age = data.get("age", profile.age)
    # profile.gender = data.get("gender", profile.gender)
    profile.previous_history = data.get("previous_history", profile.previous_history)

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"})




# -------------------DOCTOR PROFILE------------------------
@app.route('/doctor/profile/<int:user_id>')
def get_doctor_profile(user_id):
    user = User.query.get(user_id)
    profile = DoctorProfile.query.filter_by(user_id=user_id).first()

    if not user or not profile:
        return jsonify({'error': 'Doctor not found'}), 404

    return jsonify({
        "name": user.name,
        "email": user.email,
        "specialization": profile.specialization,
        "experience": profile.experience,
        "available_from": profile.available_from.strftime("%H:%M"),
        "available_to": profile.available_to.strftime("%H:%M"),
        "status": profile.status
    })


# ------------------UPDATE DOCTOR PROFILE-------------------
@app.route('/doctor/profile/update', methods=['PUT'])
def update_doctor_profile():
    data = request.json
    user_id = data['user_id']

    user = User.query.get(user_id)
    profile = DoctorProfile.query.filter_by(user_id=user_id).first()

    if not user or not profile:
        return jsonify({'error': 'Doctor not found'}), 404

    user.name = data.get("name", user.name)
    profile.specialization = data.get("specialization", profile.specialization)
    profile.experience = data.get("experience", profile.experience)

    if data.get("available_from"):
        profile.available_from = datetime.strptime(
            data["available_from"], "%H:%M"
        ).time()

    if data.get("available_to"):
        profile.available_to = datetime.strptime(
            data["available_to"], "%H:%M"
        ).time()

    db.session.commit()

    return jsonify({"message": "Doctor profile updated successfully"})





@app.route('/doctor/patient_full_profile/<int:patient_id>')
def doctor_view_patient_profile(patient_id):
    user = User.query.get(patient_id)
    profile = PatientProfile.query.filter_by(user_id=patient_id).first()

    if not user or not profile:
        return jsonify({'error': 'Patient not found'}), 404

    # Diagnosis history
    appointments = Appointment.query.filter_by(
        patient_id=patient_id,
        status="Completed"
    ).all()

    history = []
    for apt in appointments:
        diagnosis = Diagnosis.query.filter_by(
            appointment_id=apt.id
        ).first()

        if diagnosis:
            history.append({
                "disease": diagnosis.disease,
                "prescription": diagnosis.prescription,
                "notes": diagnosis.notes,
                "date": apt.created_at.strftime("%Y-%m-%d")
            })

    return jsonify({
        "name": user.name,
        "age": profile.age,
        "condition": profile.condition,
        "model_output": profile.model_output,
        "previous_history": profile.previous_history,
        "medical_reports": profile.medical_reports,
        "diagnosis_history": history
    })




# ------------------UPLOAD MEDICAL REPORTS----------------
@app.route('/upload_report', methods=['POST'])
def upload_report():
    user_id = request.form.get('user_id')
    file = request.files.get('file')

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    profile = PatientProfile.query.filter_by(user_id=user_id).first()
    profile.medical_reports = filepath

    db.session.commit()

    return jsonify({"message": "Report uploaded successfully"})



# ---------------- AUDIO UPLOAD ----------------
# @app.route('/upload_audio', methods=['POST'])
# def upload_audio():
#     user_id = request.form.get('user_id')
#     file = request.files.get('file')

#     filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
#     file.save(filepath)

#     y, sr = librosa.load(filepath, sr=16000)
#     mel = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=64)
#     mel_db = librosa.power_to_db(mel, ref=np.max)

#     mel_db = mel_db[:, :38]
#     mel_db = (mel_db - np.min(mel_db)) / (np.max(mel_db) - np.min(mel_db))
#     input_data = np.expand_dims(np.stack([mel_db]*3, axis=-1), axis=0)

#     prediction = model.predict(input_data)
#     predicted_class = np.argmax(prediction)

#     labels = {
#         0: "Asthma",
#         1: "Broncheostasis",
#         2: "Bronchiolitis",
#         3: "COPD",
#         4: "Healthy",
#         5: "Pneumonia",
#         6: "URTI"
#     }

#     result = labels.get(predicted_class)

#     patient = PatientProfile.query.filter_by(user_id=user_id).first()
#     patient.model_output = result
#     db.session.commit()

#     return jsonify({'prediction': result})


# @app.route('/upload_audio', methods=['POST'])
# def upload_audio():
#     try:
#         user_id = request.form.get('user_id')
#         file = request.files.get('file')

#         print("USER ID:", user_id)
#         print("FILE:", file)

#         filepath = os.path.join(
#             app.config['UPLOAD_FOLDER'],
#             secure_filename(file.filename)
#         )

#         file.save(filepath)

#         y, sr = librosa.load(filepath, sr=16000)

#         mel = librosa.feature.melspectrogram(
#             y=y,
#             sr=sr,
#             n_mels=64
#         )

#         mel_db = librosa.power_to_db(mel, ref=np.max)

#         mel_db = mel_db[:, :38]

#         mel_db = (
#             mel_db - np.min(mel_db)
#         ) / (
#             np.max(mel_db) - np.min(mel_db)
#         )

#         input_data = np.expand_dims(
#             np.stack([mel_db] * 3, axis=-1),
#             axis=0
#         )

#         prediction = model.predict(input_data)

#         predicted_class = np.argmax(prediction)

#         labels = {
#             0: "Asthma",
#             1: "Broncheostasis",
#             2: "Bronchiolitis",
#             3: "COPD",
#             4: "Healthy",
#             5: "Pneumonia",
#             6: "URTI"
#         }

#         result = labels.get(predicted_class)

#         patient = PatientProfile.query.filter_by(
#             user_id=user_id
#         ).first()

#         patient.model_output = result

#         db.session.commit()

#         return jsonify({"prediction": result})

#     except Exception as e:
#         print("UPLOAD AUDIO ERROR:", str(e))
#         return jsonify({"error": str(e)}), 500






# @app.route('/upload_audio', methods=['POST'])
# def upload_audio():
#     try:
#         print("========== AUDIO UPLOAD START ==========")

#         user_id = request.form.get('user_id')
#         file = request.files.get('file')

#         print("USER ID:", user_id)

#         if not file:
#             print("No file received")
#             return jsonify({"error": "No file uploaded"}), 400

#         print("FILE NAME:", file.filename)

#         filepath = os.path.join(
#             app.config['UPLOAD_FOLDER'],
#             secure_filename(file.filename)
#         )

#         file.save(filepath)

#         print("File saved:", filepath)

#         # Load audio
#         y, sr = librosa.load(filepath, sr=16000)

#         print("Audio loaded")
#         print("Audio length:", len(y))
#         print("Sample rate:", sr)

#         # Generate Mel Spectrogram
#         mel = librosa.feature.melspectrogram(
#             y=y,
#             sr=sr,
#             n_mels=64
#         )

#         print("Mel spectrogram created")
#         print("Mel shape:", mel.shape)

#         mel_db = librosa.power_to_db(
#             mel,
#             ref=np.max
#         )

#         print("Mel DB shape:", mel_db.shape)

#         # Make sure enough frames exist
#         if mel_db.shape[1] < 38:
#             print("Audio too short")
#             return jsonify({
#                 "error": f"Audio too short. Need at least 38 frames, got {mel_db.shape[1]}"
#             }), 400

#         mel_db = mel_db[:, :38]

#         print("After slicing:", mel_db.shape)

#         # Normalize
#         mel_db = (
#             mel_db - np.min(mel_db)
#         ) / (
#             np.max(mel_db) - np.min(mel_db)
#         )

#         # Model input shape
#         input_data = np.expand_dims(
#             np.stack([mel_db] * 3, axis=-1),
#             axis=0
#         )

#         print("Input shape:", input_data.shape)

#         # Prediction
#         print("Running model prediction...")

#         prediction = model.predict(input_data)

#         print("Prediction complete")
#         print("Raw prediction:", prediction)

#         predicted_class = int(np.argmax(prediction))

#         print("Predicted class:", predicted_class)

#         labels = {
#             0: "Asthma",
#             1: "Broncheostasis",
#             2: "Bronchiolitis",
#             3: "COPD",
#             4: "Healthy",
#             5: "Pneumonia",
#             6: "URTI"
#         }

#         result = labels.get(predicted_class, "Unknown")

#         print("Predicted disease:", result)

#         # Save to database
#         patient = PatientProfile.query.filter_by(
#             user_id=user_id
#         ).first()

#         if patient:
#             patient.model_output = result
#             db.session.commit()
#             print("Database updated")
#         else:
#             print("Patient profile not found")

#         print("========== AUDIO UPLOAD SUCCESS ==========")

#         return jsonify({
#             "prediction": result
#         })

#     except Exception as e:
#         print("========== AUDIO UPLOAD ERROR ==========")
#         print(str(e))

#         return jsonify({
#             "error": str(e)
#         }), 500



@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    try:
        print("STEP 1")

        file = request.files.get("file")

        print("STEP 2")

        filepath = os.path.join(
            app.config['UPLOAD_FOLDER'],
            secure_filename(file.filename)
        )

        file.save(filepath)

        print("STEP 3")

        y, sr = librosa.load(filepath, sr=16000)

        print("STEP 4")

        mel = librosa.feature.melspectrogram(
            y=y,
            sr=sr,
            n_mels=64
        )

        print("STEP 5")

        mel_db = librosa.power_to_db(
            mel,
            ref=np.max
        )

        print("STEP 6")

        return jsonify({"prediction":"Healthy"})

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


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

    # Check if active appointment already exists
    existing = Appointment.query.filter_by(
        doctor_id=data['doctor_id'],
        patient_id=data['patient_id'],
        status="Active"
    ).first()

    if existing:
        appointment=existing
    else:
        appointment=Appointment(
            doctor_id=data['doctor_id'],
            patient_id=data['patient_id']
        )
        db.session.add(appointment)
        db.session.commit()
    # 🔥 Fetch patient full profile
    patient_user = User.query.get(appointment.patient_id)
    patient_profile = PatientProfile.query.filter_by(
        user_id=appointment.patient_id
    ).first()

     # 🔥 Emit live request to doctor
    socketio.emit(
        "new_consultation_request",
        {
            "appointment_id": appointment.id,
            "patient_id": patient_user.id,
            "name": patient_user.name,
            "age": patient_profile.age,
            "condition": patient_profile.condition,
            "model_output": patient_profile.model_output
        },
        room=f"doctor_{appointment.doctor_id}"
    )

    return jsonify({
            'appointment_id': appointment.id
            # 'message': 'Existing appointment returned'
        })




@app.route('/patient/history/<int:patient_id>')
def patient_history(patient_id):
    appointments = Appointment.query.filter_by(
        patient_id=patient_id,
        status="Completed"
    ).all()

    history = []

    for apt in appointments:
        diagnosis = Diagnosis.query.filter_by(
            appointment_id=apt.id
        ).first()

        if diagnosis:
            history.append({
                "disease": diagnosis.disease,
                "prescription": diagnosis.prescription,
                "notes": diagnosis.notes,
                "date": apt.created_at.strftime("%Y-%m-%d")
            })

    return jsonify(history)



#-------------------APPOINTMENTS---------------------
@app.route('/appointment/<int:appointment_id>')
def get_appointment_details(appointment_id):
    appointment = Appointment.query.get(appointment_id)

    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404

    doctor = User.query.get(appointment.doctor_id)
    patient = User.query.get(appointment.patient_id)

    return jsonify({
        "doctor_id": doctor.id,
        "doctor_name": doctor.name,
        "patient_id": patient.id,
        "patient_name": patient.name,
        "status": appointment.status
    })

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
@socketio.on("join_doctor_room")
def join_doctor_room(data):
    room = f"doctor_{data['doctor_id']}"
    join_room(room)


# ---------------- COMPLETE CONSULTATION ----------------
@app.route('/complete_consultation', methods=['POST'])
def complete_consultation():
    data = request.json
    appointment_id = data['appointment_id']

    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404

    # Save diagnosis
    diagnosis = Diagnosis(
        appointment_id=appointment_id,
        disease=data['disease'],
        prescription=data['prescription'],
        notes=data.get('notes')
    )
    db.session.add(diagnosis)

    # Update patient condition
    patient_profile = PatientProfile.query.filter_by(
        user_id=appointment.patient_id
    ).first()

    if patient_profile:
        patient_profile.condition = data['disease']

    # Mark appointment completed
    appointment.status = "Completed"

    db.session.commit()

    # 🔥 IMPORTANT PART — Notify both users
    room = f"chat_{appointment_id}"

    socketio.emit(
        "consultation_finished",
        {
            "appointment_id": appointment_id,
            "status": "Completed"
        },
        room=room
    )

    return jsonify({'message': 'Consultation completed successfully'})







# ---------------- RUN ----------------
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)
