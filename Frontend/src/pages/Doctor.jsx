// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";

// const DoctorDashboard = () => {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [patientDetails, setPatientDetails] = useState(null);
// const [selectedAppointment, setSelectedAppointment] = useState(null);


//   const doctorId = localStorage.getItem("user_id");
//   const doctorName = localStorage.getItem("user_name");

//   // Logic remains identical
//   useEffect(() => {
//     const socket = io("http://127.0.0.1:8000");
//     socket.emit("join_doctor_room", { doctor_id: doctorId });

//     socket.on("new_consultation_request", (data) => {
//       console.log("Live request received:", data);
//       setSelectedPatient(data); 
//     });

//     return () => {
//       socket.off("new_consultation_request");
//       socket.disconnect();
//     };
//   }, [doctorId]);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/doctor/appointments/${doctorId}`);
//       const data = await res.json();
//       setAppointments(data);
//     } catch (err) {
//       console.error("Error fetching appointments:", err);
//     } finally {
//       setLoading(false);
//     }
//   };




//   const handleViewDetails = async (patientId, appointmentId) => {
//   try {
//     const res = await fetch(
//       `http://127.0.0.1:8000/doctor/patient_full_profile/${patientId}`
//     );
//     const data = await res.json();

//     setPatientDetails(data);
//     setSelectedAppointment(appointmentId);
//   } catch (error) {
//     console.error("Failed to fetch patient details");
//   }
// };


//   return (
//     <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
//       {/* Refined Header */}
//       <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-xl">+</span>
//             </div>
//             <h1 className="text-xl font-bold tracking-tight text-slate-800">
//               Med<span className="text-blue-600">Dash</span>
//             </h1>
//           </div>

//           <div className="flex items-center gap-6">
//             {/* <div className="text-right hidden sm:block">
//               <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Welcome back</p>
//               <p className="text-sm font-semibold text-slate-800">Dr. {doctorName || "User"}</p>
//             </div> */}
//             <button
//               onClick={() => navigate("/doctor/profile")}
//               className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-50 transition-all shadow-sm"
//             >
//               View Profile
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto p-6 lg:p-10">
//         {/* Statistics or Status Bar */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//           <div>
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
//               Patient Queue
//             </h2>
//             <p className="text-slate-500 mt-1">
//               {appointments.length} active consultation{appointments.length !== 1 ? 's' : ''} for today.
//             </p>
//           </div>
          
//           <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
//             <span className="relative flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
//             </span>
//             <span className="text-sm font-bold uppercase tracking-wide">Live Updates On</span>
//           </div>
//         </div>

//         {/* Loading / Empty States */}
//         {loading ? (
//           <div className="grid md:grid-cols-2 gap-6">
//             {[1, 2].map((i) => (
//               <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>
//             ))}
//           </div>
//         ) : appointments.length === 0 ? (
//           <div className="bg-white border-2 border-dashed border-slate-200 p-16 rounded-3xl text-center">
//             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-2xl">☕</span>
//             </div>
//             <h3 className="text-lg font-bold text-slate-800">All clear!</h3>
//             <p className="text-slate-500">No patients are currently waiting in the queue.</p>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {appointments.map((apt) => (
//               <div
//                 key={apt.appointment_id}
//                 className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
//                 onClick={() => setSelectedPatient(apt)}
//               >
//                 {/* Visual Accent */}
//                 <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-50 transition-colors">
//                     👤
//                   </div>
//                   <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase">
//                     ID: {apt.appointment_id.toString().slice(-4)}
//                   </span>
//                 </div>

//                 <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
//                   {apt.name}
//                 </h3>
                
//                 <div className="flex gap-3 text-sm text-slate-500 mb-4">
//                   <span>Age: <b className="text-slate-700">{apt.age || "N/A"}</b></span>
//                   <span>•</span>
//                   <span>Status: <b className="text-green-600 font-semibold">Waiting</b></span>
//                 </div>

//                 <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
//                   <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">AI Prediction</p>
//                   <p className="text-sm font-medium text-slate-700 italic">
//                     "{apt.model_output || "No analysis available"}"
//                   </p>
//                 </div>

//                 {/* <button
//                   className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:shadow-blue-200"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/chatroom/${apt.appointment_id}`, {
//                       state: { doctorName, patientName: apt.name, userRole: "doctor", doctorId, patientId: apt.patient_id, appointmentId: apt.appointment_id },
//                     });
//                   }}
//                 >
//                   Enter Consultation
//                 </button> */}
//                 <button
//                     className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition"
//                     onClick={(e) => {
//                     e.stopPropagation();
//                     handleViewDetails(apt.patient_id, apt.appointment_id);
//                     }}
//                 >
//                     View Details
//                   </button>

//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Modern Patient Modal */}
//       {selectedPatient && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div 
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setSelectedPatient(null)}
//           ></div>
//           <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//             <div className="bg-blue-600 p-8 text-white">
//               <h3 className="text-2xl font-bold">Patient Overview</h3>
//               <p className="opacity-80 text-sm mt-1">Review clinical data before starting the chat.</p>
//             </div>
            
//             <div className="p-8 space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="p-4 bg-slate-50 rounded-2xl">
//                   <p className="text-xs text-slate-400 font-bold uppercase mb-1">Name</p>
//                   <p className="font-bold text-slate-800">{selectedPatient.name}</p>
//                 </div>
//                 <div className="p-4 bg-slate-50 rounded-2xl">
//                   <p className="text-xs text-slate-400 font-bold uppercase mb-1">Age</p>
//                   <p className="font-bold text-slate-800">{selectedPatient.age || "N/A"}</p>
//                 </div>
//               </div>

//               <div className="p-4 bg-slate-50 rounded-2xl">
//                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Reported Condition</p>
//                 <p className="text-slate-700 font-medium">{selectedPatient.condition || "Not specified by patient"}</p>
//               </div>

//               <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
//                 <p className="text-xs text-blue-400 font-bold uppercase mb-1">AI Diagnostic Insight</p>
//                 <p className="text-blue-900 font-bold text-lg">{selectedPatient.model_output || "Analysis pending"}</p>
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <button
//                   onClick={() => setSelectedPatient(null)}
//                   className="flex-1 px-4 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
//                 >
//                   Dismiss
//                 </button>

//                 <button
//                   onClick={() => navigate(`/chatroom/${selectedPatient.appointment_id}`, {
//                       state: { doctorName, patientName: selectedPatient.name, userRole: "doctor", doctorId, patientId: selectedPatient.patient_id, appointmentId: selectedPatient.appointment_id },
//                     })
//                   }
//                   className="flex-[2] px-4 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
//                 >
//                   Begin Consultation
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorDashboard;









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
