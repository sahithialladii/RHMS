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








// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";

// const socket = io("http://127.0.0.1:8000");

// const Doctor = () => {
//   const navigate = useNavigate();
//   const [patients, setPatients] = useState([]);
//   const [availability, setAvailability] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [chatNotifications, setChatNotifications] = useState([]);
//   const doctorId = localStorage.getItem("user_id");
//   const doctorName = localStorage.getItem("user_name");

//   // 🩺 Fetch connected patients
//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         // const res = await fetch(`http://127.0.0.1:8000/doctor_patients/${doctorId}`);
//         // const data = await res.json();
//         // setPatients(data);
//         const doctorId = localStorage.getItem("user_id");
//       const res = await fetch(`http://127.0.0.1:8000/doctor/appointments/${doctorId}`);
//       const data = await res.json();
//       setAppointments(data);
//       } catch (err) {
//         console.error("Error fetching patients:", err);
//       }
//     };
//     // fetchPatients();
//     fetchAppointments();
//   }, [doctorId]);

//   // ✅ Listen for patient chat connection
//   useEffect(() => {
//     socket.on("patient_ready", (data) => {
//       setChatNotifications((prev) => [...prev, data]);
//       alert(`📩 Patient ${data.patient_name} is ready to chat!`);
//     });

//     return () => socket.off("patient_ready");
//   }, []);

//   // ✅ Update availability
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

//   // ✅ Handle Chat
//   const handleChat = (appointmentId, patientName, patientId) => {
//     navigate(`/chatroom/${appointmentId}`, {
//       state: {
//         doctorName,
//         patientName,
//         userRole: "doctor",
//         doctorId,
//         patientId,
//       },
//     });
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* 🔹 Navbar */}
//       <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
//         <h1
//           onClick={() => navigate("/")}
//           className="text-2xl font-bold cursor-pointer hover:text-blue-200"
//         >
//           🩺 Doctor Dashboard
//         </h1>
//         <button
//           onClick={() => navigate("/doctor/profile")}
//           className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
//         >
//           My Profile
//         </button>
//       </nav>

//       {/* 🔹 Main Content */}
//       <div className="flex flex-col items-center flex-grow p-6">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8">
//           {/* Availability */}
//           <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
//             Doctor Availability
//           </h2>
//           <div className="flex gap-4 justify-center mb-8">
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

//           {/* Connected Patients */}
//           <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
//             Connected Patients
//           </h2>

//           {patients.length === 0 ? (
//             <p className="text-gray-600 text-center">No patients connected yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {patients.map((p) => (
//                 <div
//                   key={p.patient_id}
//                   className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-5 hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
//                   onClick={() => setSelectedPatient(p)}
//                 >
//                   <h3 className="text-xl font-semibold text-blue-800">
//                     👤 {p.name}
//                   </h3>
//                   <p className="text-gray-700 mt-2">
//                     <strong>Age:</strong> {p.age}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Condition:</strong> {p.condition || "Unknown"}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Model Output:</strong>{" "}
//                     <span className="text-blue-600 font-semibold">
//                       {p.model_output || "N/A"}
//                     </span>
//                   </p>
//                   <p className="text-gray-500 text-sm mt-2">
//                     🕓 {new Date(p.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 🔹 Patient Detail Modal */}
//       {selectedPatient && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
//             <button
//               onClick={() => setSelectedPatient(null)}
//               className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
//             >
//               ×
//             </button>
//             <h3 className="text-2xl font-semibold text-blue-700 mb-4">
//               👤 {selectedPatient.name}'s Profile
//             </h3>
//             <p><strong>Age:</strong> {selectedPatient.age}</p>
//             <p><strong>Condition:</strong> {selectedPatient.condition}</p>
//             <p><strong>Model Output:</strong> {selectedPatient.model_output}</p>
//             <p><strong>Audio File:</strong> {selectedPatient.audio}</p>
//             <p><strong>Status:</strong> {selectedPatient.status}</p>
//             <p className="text-gray-600 text-sm mt-2">
//               Connected on {new Date(selectedPatient.timestamp).toLocaleString()}
//             </p>

//             <div className="mt-6 flex justify-center">
//               <button
//                 onClick={() =>
//                   handleChat(
//                     selectedPatient.appointment_id || 1, // ensure backend returns appointment_id
//                     selectedPatient.name,
//                     selectedPatient.patient_id
//                   )
//                 }
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//               >
//                 💬 Chat with {selectedPatient.name}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Doctor;









// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";

// // ✅ Socket connection
// const socket = io("http://127.0.0.1:8000");

// const Doctor = () => {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [availability, setAvailability] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [chatNotifications, setChatNotifications] = useState([]);

//   const doctorId = localStorage.getItem("user_id");
//   const doctorName = localStorage.getItem("user_name");

//   // 🩺 Fetch doctor’s appointments (patients)
//   const fetchAppointments = async () => {
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:8000/doctor/appointments/${doctorId}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch appointments");
//       const data = await res.json();
//       setAppointments(data);
//     } catch (err) {
//       console.error("Error fetching appointments:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, [doctorId]);

//   // ✅ Listen for patient ready chat notifications
//   useEffect(() => {
//     socket.on("patient_ready", (data) => {
//       setChatNotifications((prev) => [...prev, data]);
//       alert(`📩 Patient ${data.patient_name} is ready to chat!`);
//     });

//     return () => socket.off("patient_ready");
//   }, []);

//   // ✅ Update doctor availability
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

//   // ✅ Handle Chat Navigation
//   const handleChat = (appointmentId, patientName, patientId) => {
//     navigate(`/chatroom/${appointmentId}`, {
//       state: {
//         doctorName,
//         patientName,
//         userRole: "doctor",
//         doctorId,
//         patientId,
//       },
//     });
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* 🔹 Navbar */}
//       <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
//         <h1
//           onClick={() => navigate("/")}
//           className="text-2xl font-bold cursor-pointer hover:text-blue-200"
//         >
//           🩺 Doctor Dashboard
//         </h1>
//         <button
//           onClick={() => navigate("/doctor/profile")}
//           className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
//         >
//           My Profile
//         </button>
//       </nav>

//       {/* 🔹 Main Content */}
//       <div className="flex flex-col items-center flex-grow p-6">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8">
//           {/* Availability */}
//           <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
//             Doctor Availability
//           </h2>
//           <div className="flex gap-4 justify-center mb-8">
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

//           {/* Connected Patients */}
//           <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
//             Connected Patients
//           </h2>

//           {appointments.length === 0 ? (
//             <p className="text-gray-600 text-center">
//               No patients connected yet.
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {appointments.map((p) => (
//                 <div
//                   key={p.patient_id}
//                   className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-5 hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
//                   onClick={() => setSelectedPatient(p)}
//                 >
//                   <h3 className="text-xl font-semibold text-blue-800">
//                     👤 {p.name}
//                   </h3>
//                   <p className="text-gray-700 mt-2">
//                     <strong>Age:</strong> {p.age || "N/A"}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Condition:</strong> {p.condition || "Unknown"}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Model Output:</strong>{" "}
//                     <span className="text-blue-600 font-semibold">
//                       {p.model_output || "N/A"}
//                     </span>
//                   </p>
//                   <p className="text-gray-500 text-sm mt-2">
//                     🕓 {new Date(p.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 🔹 Patient Detail Modal */}
//       {selectedPatient && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
//             <button
//               onClick={() => setSelectedPatient(null)}
//               className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
//             >
//               ×
//             </button>
//             <h3 className="text-2xl font-semibold text-blue-700 mb-4">
//               👤 {selectedPatient.name}'s Profile
//             </h3>
//             <p>
//               <strong>Age:</strong> {selectedPatient.age || "N/A"}
//             </p>
//             <p>
//               <strong>Condition:</strong> {selectedPatient.condition || "N/A"}
//             </p>
//             <p>
//               <strong>Model Output:</strong>{" "}
//               {selectedPatient.model_output || "N/A"}
//             </p>
//             <p>
//               <strong>Audio File:</strong>{" "}
//               {selectedPatient.audio ? (
//                 <a
//                   href={`http://127.0.0.1:8000/uploads/${selectedPatient.audio}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   {selectedPatient.audio}
//                 </a>
//               ) : (
//                 "N/A"
//               )}
//             </p>
//             <p>
//               <strong>Status:</strong> {selectedPatient.status || "N/A"}
//             </p>
//             <p className="text-gray-600 text-sm mt-2">
//               Connected on{" "}
//               {new Date(selectedPatient.timestamp).toLocaleString()}
//             </p>

//             <div className="mt-6 flex justify-center">
//               <button
//                 onClick={() =>
//                   handleChat(
//                     selectedPatient.appointment_id || 1,
//                     selectedPatient.name,
//                     selectedPatient.patient_id
//                   )
//                 }
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//               >
//                 💬 Chat with {selectedPatient.name}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Doctor;





// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";

// const socket = io("http://127.0.0.1:8000");

// const DoctorDashboard = () => {
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [availability, setAvailability] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [notifications, setNotifications] = useState([]);

//   const doctorId = localStorage.getItem("user_id");
//   const doctorName = localStorage.getItem("user_name");

//   useEffect(() => {
//     fetchAppointments();
//   }, [doctorId]);


//   const fetchAppointments = async () => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/doctor/appointments/${doctorId}`);
//       if (!res.ok) throw new Error("Failed to fetch");
//       const data = await res.json();
//       setAppointments(data);
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   const handleUpdateAvailability = async () => {
//     if (!availability) return alert("Please select a time.");
//     setLoading(true);
//     try {
//       await fetch("http://127.0.0.1:8000/update_availability", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ doctor_id: doctorId, available_time: availability }),
//       });
//       alert("Availability updated!");
//     } catch (err) {
//       alert("Update failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
//       {/* --- Header --- */}
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
//           <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
//             <div className="bg-blue-600 p-2 rounded-lg text-white">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
//             </div>
//             <h1 className="text-xl font-bold tracking-tight">MedConnect <span className="text-blue-600">MD</span></h1>
//           </div>
//           <button onClick={() => navigate("/doctor/profile")} className="text-sm font-medium hover:text-blue-600 transition">
//             Dr. {doctorName} • <span className="text-slate-500">Settings</span>
//           </button>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* --- Left Column: Availability & Status --- */}
//         <section className="lg:col-span-1 space-y-6">
//           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//             <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//               Active Status
//             </h2>
//             <div className="space-y-4">
//               <label className="text-sm text-slate-500 block">Next Available Slot</label>
//               <input 
//                 type="time" 
//                 value={availability} 
//                 onChange={(e) => setAvailability(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
//               />
//               <button 
//                 onClick={handleUpdateAvailability}
//                 disabled={loading}
//                 className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition disabled:bg-slate-300"
//               >
//                 {loading ? "Updating..." : "Update Availability"}
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* --- Right Column: Notifications & Patient Queue --- */}
//         <section className="lg:col-span-2 space-y-6">
//           <div className="flex justify-between items-end">
//             <div>
//               <h2 className="text-2xl font-bold">Patient Requests</h2>
//               <p className="text-slate-500">Incoming chat notifications and pending reviews.</p>
//             </div>
//             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
//               {notifications.length} New
//             </span>
//           </div>

//           { appointments.length === 0 ? (
//             <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
//               <p className="text-slate-400 font-medium">No active connection requests at the moment.</p>
//             </div>
//           ) : (
//             <div className="grid gap-4">
//               {/* Prioritize Notifications from Socket */}
//               {/* Existing Appointments */}
//               {appointments.map((apt) => (
//                 <NotificationCard 
//                   key={apt.patient_id} 
//                   data={apt} 
//                   isLive={true}
//                   onClick={() => setSelectedPatient(apt)} 
//                 />
//               ))}
//             </div>
//           )}
//         </section>
//       </main>

//       {/* --- Patient Detail Modal --- */}
//       {selectedPatient && (
//         <PatientModal 
//           patient={selectedPatient} 
//           onClose={() => setSelectedPatient(null)} 
//           onChat={() => navigate(`/chatroom/${selectedPatient.appointment_id}`, {
//             state: { doctorName, 
//               patientName: selectedPatient.name,
//                userRole: "doctor", 
//                doctorId, 
//                patientId: selectedPatient.patient_id,
//                appointmentId: selectedPatient.appointment_id
//                }
//           })}
//         />
//       )}
//     </div>
//   );
// };

// // Sub-component for individual notification cards
// const NotificationCard = ({ data, onClick, isLive }) => (
//   <button 
//     onClick={onClick}
//     className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group
//       ${isLive ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'}`}
//   >
//     <div className="flex items-center gap-4">
//       <div className={`p-3 rounded-full ${isLive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
//       </div>
//       <div>
//         <h3 className="font-bold text-slate-800">{data.name}</h3>
//         <p className="text-sm text-slate-500">{data.condition || "General Consultation"}</p>
//       </div>
//     </div>
//     <div className="flex items-center gap-3">
//       {isLive && <span className="text-xs font-black text-blue-600 animate-pulse">LIVE REQ</span>}
//       <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-2 rounded-lg transition-colors">
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
//       </div>
//     </div>
//   </button>
// );

// // Sub-component for the Modal
// const PatientModal = ({ patient, onClose, onChat }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//     <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//       <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
//         <h3 className="text-xl font-bold">Patient Profile</h3>
//         <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-lg">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//         </button>
//       </div>
//       <div className="p-8">
//         <div className="grid grid-cols-2 gap-6 mb-8">
//           <div>
//             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name</label>
//             <p className="font-semibold text-lg">{patient.name}</p>
//           </div>
//           <div>
//             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Age</label>
//             <p className="font-semibold text-lg">{patient.age || "N/A"} Years</p>
//           </div>
//           <div className="col-span-2">
//             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Condition</label>
//             <p className="font-medium bg-red-50 text-red-700 px-3 py-1 rounded-md mt-1 inline-block">
//               {patient.condition || "Not specified"}
//             </p>
//           </div>
//           <div className="col-span-2">
//             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Prediction</label>
//             <p className="font-mono bg-slate-100 p-2 rounded-lg mt-1 text-blue-700">{patient.model_output || "No data available"}</p>
//           </div>
//         </div>
        
//         <button 
//           onClick={onChat}
//           className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.855-1.246L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
//           Accept & Start Chat
//         </button>
//       </div>
//     </div>
//   </div>
// );

// export default DoctorDashboard;








import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const doctorId = localStorage.getItem("user_id");
  const doctorName = localStorage.getItem("user_name");

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

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            Doctor Dashboard
          </h1>
          <div className="text-slate-700 font-medium">
            Dr. {doctorName}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">

        <h2 className="text-xl font-semibold mb-6">
          Active Appointments
        </h2>

        {loading ? (
          <div className="text-slate-500">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-slate-500">
            No active patients right now.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {appointments.map((apt) => (
              <div
                key={apt.appointment_id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedPatient(apt)}
              >
                <h3 className="text-lg font-bold text-slate-800">
                  {apt.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Age: {apt.age || "N/A"}
                </p>

                <p className="mt-2">
                  <span className="text-xs font-semibold text-slate-400">
                    AI Prediction:
                  </span>
                  <br />
                  <span className="text-blue-600 font-medium">
                    {apt.model_output || "Not available"}
                  </span>
                </p>

                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/chatroom/${apt.appointment_id}`, {
                      state: {
                        doctorName,
                        patientName: apt.name,
                        userRole: "doctor",
                        doctorId,
                        patientId: apt.patient_id,
                        appointmentId: apt.appointment_id,
                      },
                    });
                  }}
                >
                  Start Consultation
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Patient Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            
            <h3 className="text-xl font-bold mb-4">
              Patient Details
            </h3>

            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age || "N/A"}</p>
            <p><strong>Condition:</strong> {selectedPatient.condition || "Not specified"}</p>
            <p className="mt-2">
              <strong>AI Prediction:</strong>{" "}
              <span className="text-blue-600">
                {selectedPatient.model_output || "No data"}
              </span>
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
              >
                Close
              </button>

              <button
                onClick={() =>
                  navigate(`/chatroom/${selectedPatient.appointment_id}`, {
                    state: {
                      doctorName,
                      patientName: selectedPatient.name,
                      userRole: "doctor",
                      doctorId,
                      patientId: selectedPatient.patient_id,
                      appointmentId: selectedPatient.appointment_id,
                    },
                  })
                }
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Start Chat
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
