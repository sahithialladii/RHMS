// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const DoctorPage = () => {
//   const navigate = useNavigate();

//   // Example patient data (replace with data from backend)
//   const patients = [
//     { id: 1, name: "Aarav Sharma", age: 25, condition: "Fever", contact: "aarav@example.com", notes: "Fever for 3 days, mild cough." },
//     { id: 2, name: "Priya Verma", age: 31, condition: "Back Pain", contact: "priya@example.com", notes: "Chronic lower back pain, MRI scheduled." },
//     { id: 3, name: "Rohan Das", age: 40, condition: "Diabetes", contact: "rohan@example.com", notes: "Type 2 diabetes, taking Metformin." },
//   ];

//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;
//     setMessages([...messages, { sender: "Doctor", text: newMessage }]);
//     setNewMessage("");
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* 🔹 Top Navigation Bar */}
//       <nav className="bg-blue-700 text-white flex justify-between items-center px-6 py-3 shadow-md">
//         <h1
//           onClick={() => navigate("/")}
//           className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition"
//         >
//           🩺 Doctor Dashboard
//         </h1>
//         <button
//           onClick={() => navigate("/doctor/profile")}
//           className="bg-white text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-100 transition"
//         >
//           View Profile
//         </button>
//       </nav>

//       {/* 🔹 Main Content Area */}
//       <div className="flex flex-1">
//         {/* Sidebar - Patients list */}
//         <div className="w-1/4 bg-white shadow-md border-r">
//           <h2 className="text-2xl font-semibold text-center p-4 bg-blue-600 text-white">
//             My Patients
//           </h2>
//           <ul>
//             {patients.map((patient) => (
//               <li
//                 key={patient.id}
//                 className={`p-4 cursor-pointer border-b hover:bg-blue-50 ${
//                   selectedPatient?.id === patient.id ? "bg-blue-100" : ""
//                 }`}
//                 onClick={() => {
//                   setSelectedPatient(patient);
//                   setMessages([]); // clear chat when switching patients
//                 }}
//               >
//                 <p className="font-semibold text-gray-800">{patient.name}</p>
//                 <p className="text-sm text-gray-500">{patient.condition}</p>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Main content area */}
//         <div className="flex-1 flex flex-col">
//           {/* Header */}
//           {selectedPatient ? (
//             <>
//               <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     {selectedPatient.name}
//                   </h2>
//                   <p className="text-gray-500 text-sm">{selectedPatient.condition}</p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedPatient(null)}
//                   className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
//                 >
//                   Back
//                 </button>
//               </div>

//               {/* Patient Details */}
//               <div className="p-4 bg-gray-50 border-b">
//                 <h3 className="text-lg font-semibold mb-2">Patient Details</h3>
//                 <p><strong>Age:</strong> {selectedPatient.age}</p>
//                 <p><strong>Contact:</strong> {selectedPatient.contact}</p>
//                 <p><strong>Notes:</strong> {selectedPatient.notes}</p>
//               </div>

//               {/* Chat Area */}
//               <div className="flex-1 flex flex-col justify-between bg-white">
//                 <div className="p-4 overflow-y-auto space-y-3 flex-1">
//                   {messages.length === 0 ? (
//                     <p className="text-gray-400 text-center mt-10">No messages yet.</p>
//                   ) : (
//                     messages.map((msg, i) => (
//                       <div
//                         key={i}
//                         className={`flex ${
//                           msg.sender === "Doctor" ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`px-4 py-2 rounded-2xl max-w-xs ${
//                             msg.sender === "Doctor"
//                               ? "bg-blue-600 text-white"
//                               : "bg-gray-200 text-gray-800"
//                           }`}
//                         >
//                           {msg.text}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {/* Input Box */}
//                 <div className="p-4 border-t flex items-center gap-2 bg-gray-50">
//                   <input
//                     type="text"
//                     placeholder="Type a message..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center justify-center flex-1 text-gray-400 text-lg">
//               Select a patient to view details and start chatting 💬
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorPage;




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Doctor = () => {
//   const navigate = useNavigate();
//   const [patients, setPatients] = useState([]);
//   const [availability, setAvailability] = useState("");
//   const [loading, setLoading] = useState(false);
//   const doctorId = localStorage.getItem("user_id");

//   // Fetch doctor’s patients
//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const res = await fetch(`http://127.0.0.1:8000/doctor_patients/${doctorId}`);
//         const data = await res.json();
//         setPatients(data);
//       } catch (err) {
//         console.error("Error fetching patients:", err);
//       }
//     };
//     fetchPatients();
//   }, [doctorId]);

//   // Update availability
//   const handleUpdateAvailability = async () => {
//     if (!availability) {
//       alert("Please select your available time.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch("http://127.0.0.1:8000/update_availability", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           doctor_id: doctorId,
//           available_time: availability,
//         }),
//       });

//       const data = await res.json();
//       alert(data.message || "Availability updated!");
//     } catch (err) {
//       console.error(err);
//       alert("Error updating availability.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* Navbar */}
//       <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
//         <h1
//           onClick={() => navigate("/")}
//           className="text-2xl font-bold cursor-pointer"
//         >
//           🩺 Doctor Dashboard
//         </h1>
//         <button
//           onClick={() => navigate("/doctor/profile")}
//           className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100"
//         >
//           My Profile
//         </button>
//       </nav>

//       {/* Main Content */}
//       <div className="flex flex-col items-center flex-grow p-6">
//         <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8">
//           <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
//             Doctor Availability
//           </h2>
//           <div className="flex gap-4 justify-center mb-6">
//             <input
//               type="time"
//               value={availability}
//               onChange={(e) => setAvailability(e.target.value)}
//               className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//             />
//             <button
//               onClick={handleUpdateAvailability}
//               disabled={loading}
//               className={`${
//                 loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//               } text-white px-6 py-2 rounded-lg font-semibold shadow-lg`}
//             >
//               {loading ? "Updating..." : "Update Availability"}
//             </button>
//           </div>

//           <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
//             Connected Patients
//           </h2>

//           {patients.length === 0 ? (
//             <p className="text-gray-600 text-center">No patients connected yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full border border-gray-300 rounded-lg">
//                 <thead className="bg-blue-100">
//                   <tr>
//                     <th className="p-3 border">Patient Name</th>
//                     <th className="p-3 border">Age</th>
//                     <th className="p-3 border">Condition</th>
//                     <th className="p-3 border">Model Output</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {patients.map((p) => (
//                     <tr key={p.patient_id} className="hover:bg-gray-50">
//                       <td className="p-3 border text-center">{p.name}</td>
//                       <td className="p-3 border text-center">{p.age}</td>
//                       <td className="p-3 border text-center">{p.condition}</td>
//                       <td className="p-3 border text-center text-blue-600 font-semibold">
//                         {p.model_output || "N/A"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Doctor;








import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:8000");

const Doctor = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [availability, setAvailability] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatNotifications, setChatNotifications] = useState([]);
  const doctorId = localStorage.getItem("user_id");
  const doctorName = localStorage.getItem("user_name");

  // 🩺 Fetch connected patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/doctor_patients/${doctorId}`);
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, [doctorId]);

  // ✅ Listen for patient chat connection
  useEffect(() => {
    socket.on("patient_ready", (data) => {
      setChatNotifications((prev) => [...prev, data]);
      alert(`📩 Patient ${data.patient_name} is ready to chat!`);
    });

    return () => socket.off("patient_ready");
  }, []);

  // ✅ Update availability
  const handleUpdateAvailability = async () => {
    if (!availability) {
      alert("Please select your available time.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/update_availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctorId,
          available_time: availability,
        }),
      });

      const data = await res.json();
      alert(data.message || "Availability updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating availability.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Chat
  const handleChat = (appointmentId, patientName, patientId) => {
    navigate(`/chatroom/${appointmentId}`, {
      state: {
        doctorName,
        patientName,
        userRole: "doctor",
        doctorId,
        patientId,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 🔹 Navbar */}
      <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer hover:text-blue-200"
        >
          🩺 Doctor Dashboard
        </h1>
        <button
          onClick={() => navigate("/doctor/profile")}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
        >
          My Profile
        </button>
      </nav>

      {/* 🔹 Main Content */}
      <div className="flex flex-col items-center flex-grow p-6">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8">
          {/* Availability */}
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
            Doctor Availability
          </h2>
          <div className="flex gap-4 justify-center mb-8">
            <input
              type="time"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleUpdateAvailability}
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-6 py-2 rounded-lg font-semibold shadow-lg`}
            >
              {loading ? "Updating..." : "Update Availability"}
            </button>
          </div>

          {/* Connected Patients */}
          <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
            Connected Patients
          </h2>

          {patients.length === 0 ? (
            <p className="text-gray-600 text-center">No patients connected yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patients.map((p) => (
                <div
                  key={p.patient_id}
                  className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-5 hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedPatient(p)}
                >
                  <h3 className="text-xl font-semibold text-blue-800">
                    👤 {p.name}
                  </h3>
                  <p className="text-gray-700 mt-2">
                    <strong>Age:</strong> {p.age}
                  </p>
                  <p className="text-gray-700">
                    <strong>Condition:</strong> {p.condition || "Unknown"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Model Output:</strong>{" "}
                    <span className="text-blue-600 font-semibold">
                      {p.model_output || "N/A"}
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    🕓 {new Date(p.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              👤 {selectedPatient.name}'s Profile
            </h3>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Condition:</strong> {selectedPatient.condition}</p>
            <p><strong>Model Output:</strong> {selectedPatient.model_output}</p>
            <p><strong>Audio File:</strong> {selectedPatient.audio}</p>
            <p><strong>Status:</strong> {selectedPatient.status}</p>
            <p className="text-gray-600 text-sm mt-2">
              Connected on {new Date(selectedPatient.timestamp).toLocaleString()}
            </p>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() =>
                  handleChat(
                    selectedPatient.appointment_id || 1, // ensure backend returns appointment_id
                    selectedPatient.name,
                    selectedPatient.patient_id
                  )
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                💬 Chat with {selectedPatient.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;
