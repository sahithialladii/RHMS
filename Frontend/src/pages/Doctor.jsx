import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientDetails, setPatientDetails] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const doctorId = localStorage.getItem("user_id");
  const doctorName = localStorage.getItem("user_name");

  // 🔴 Live Socket Updates
  useEffect(() => {
    const socket = io("http://127.0.0.1:8000");
    // const socket = io("https://rhms-b9d9.onrender.com");

    socket.emit("join_doctor_room", { doctor_id: doctorId });

    socket.on("new_consultation_request", (data) => {
      console.log("Live request received:", data);
      fetchAppointments(); // refresh list automatically
    });

    return () => {
      socket.disconnect();
    };
  }, [doctorId]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/doctor/appointments/${doctorId}`
        // `https://rhms-b9d9.onrender.com/doctor/appointments/${doctorId}`
      );
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Fetch Full Patient Details
  const handleViewDetails = async (patientId, appointmentId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/doctor/patient_full_profile/${patientId}`
        // `https://rhms-b9d9.onrender.com/doctor/patient_full_profile/${patientId}`
      );
      const data = await res.json();

      setPatientDetails(data);
      setSelectedAppointment(appointmentId);
    } catch (error) {
      console.error("Failed to fetch patient details");
    }
  };

  // 🔹 Reusable Info Card
  const InfoCard = ({ title, value }) => (
    <div className="bg-slate-50 p-4 rounded-2xl border">
      <p className="text-xs uppercase font-bold text-slate-400 mb-1">
        {title}
      </p>
      <p className="text-slate-800 font-medium">
        {value || "Not available"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">
            Dr. {doctorName || "Doctor"}
          </h1>

          <button
            onClick={() => navigate("/doctor/profile")}
            className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-50"
          >
            View Profile
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6">

        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Patient Queue
          </h2>
          <p className="text-slate-500 mt-1">
            {appointments.length} active consultation
            {appointments.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 p-16 rounded-3xl text-center">
            <h3 className="text-lg font-bold text-slate-800">
              No patients waiting
            </h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((apt) => (
              <div
                key={apt.appointment_id}
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold mb-2">{apt.name}</h3>

                <p className="text-sm text-slate-500 mb-2">
                  Age: <b>{apt.age || "N/A"}</b>
                </p>

                <p className="text-sm text-slate-500 mb-4">
                  AI Prediction:{" "}
                  <b>{apt.model_output || "Pending"}</b>
                </p>

                <button
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition"
                  onClick={() =>
                    handleViewDetails(
                      apt.patient_id,
                      apt.appointment_id
                    )
                  }
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🔵 FULL PATIENT PROFILE MODAL */}
      {patientDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPatientDetails(null)}
          ></div>

          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold">
                Patient Full Profile
              </h2>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              <div className="grid grid-cols-2 gap-4">
                <InfoCard title="Name" value={patientDetails.name} />
                <InfoCard title="Age" value={patientDetails.age} />
              </div>

              <InfoCard
                title="Current Condition"
                value={patientDetails.condition}
              />

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                <p className="text-xs uppercase font-bold text-blue-500 mb-1">
                  AI Prediction
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {patientDetails.model_output || "No analysis available"}
                </p>
              </div>

              <InfoCard
                title="Previous Medical History"
                value={patientDetails.previous_history}
              />

              <InfoCard
                title="Medical Reports"
                value={
                  patientDetails.medical_reports
                    ? "Report uploaded"
                    : "No reports uploaded"
                }
              />

              {/* Diagnosis History */}
              <div>
                <h3 className="font-bold mb-2">
                  Diagnosis History
                </h3>

                {patientDetails.diagnosis_history &&
                patientDetails.diagnosis_history.length > 0 ? (
                  patientDetails.diagnosis_history.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 p-4 rounded-xl mb-2 border"
                      >
                        <p><strong>Disease:</strong> {item.disease}</p>
                        <p><strong>Prescription:</strong> {item.prescription}</p>
                        <p><strong>Date:</strong> {item.date}</p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-500">
                    No past consultations
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setPatientDetails(null)}
                  className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/chatroom/${selectedAppointment}`,
                      {
                        state: {
                          doctorName,
                          patientName: patientDetails.name,
                          userRole: "doctor",
                          doctorId,
                          appointmentId: selectedAppointment,
                        },
                      }
                    )
                  }
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
                >
                  Start Chat
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
