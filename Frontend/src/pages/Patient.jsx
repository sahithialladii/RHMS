// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Patient = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMessage("Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/upload_audio", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Upload failed.");
//       const data = await res.json();
//       setMessage(`✅ Upload successful: ${data.message || "File uploaded."}`);
//     } catch (err) {
//       setMessage("❌ Error uploading audio. Please try again.");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col">
//       {/* 🔹 Top Navbar */}
//       <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
//         <h1
//           onClick={() => navigate("/")}
//           className="text-xl font-bold cursor-pointer hover:text-gray-200"
//         >
//           🩺 Patient Dashboard
//         </h1>
//         <button
//           onClick={() => navigate("/patient/profile")}
//           className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition duration-300"
//         >
//           My Profile
//         </button>
//       </nav>

//       {/* 🔹 Main Content */}
//       <div className="flex-grow flex flex-col items-center justify-center p-6">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
//           <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
//             🎧 Record & Upload Your Lung Sound
//           </h1>

//           {/* Instructions */}
//           <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg mb-6">
//             <h2 className="text-lg font-semibold text-indigo-700 mb-2">
//               🩺 Instructions for Recording Lung Sounds:
//             </h2>
//             <ul className="list-disc ml-6 text-gray-700 space-y-1">
//               <li>Find a quiet environment to reduce background noise.</li>
//               <li>Use a high-quality microphone or stethoscope-mic if available.</li>
//               <li>Keep the microphone 1–2 cm away from your chest or back.</li>
//               <li>Take slow, deep breaths during recording (around 10 seconds).</li>
//               <li>Record from different lung regions if instructed.</li>
//               <li>Save your file in .wav format for best results.</li>
//               <li>Avoid coughing or talking during recording.</li>
//             </ul>
//           </div>

//           {/* Upload Form */}
//           <form
//             onSubmit={handleUpload}
//             className="flex flex-col items-center justify-center space-y-4"
//           >
//             <label className="block text-gray-700 font-semibold">
//               Upload your recorded lung sound (.wav):
//             </label>
//             <input
//               type="file"
//               accept=".wav"
//               onChange={handleFileChange}
//               className="border border-gray-300 rounded-lg p-2 w-full max-w-md focus:ring-2 focus:ring-indigo-400"
//               required
//             />
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
//             >
//               Upload Audio
//             </button>
//           </form>

//           {/* Status Message */}
//           {message && (
//             <p className="mt-4 text-center font-medium text-gray-700">
//               {message}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Patient;











// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Patient = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setMessage("");
//     setPrediction("");
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setMessage("⚠️ Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);
//       setMessage("⏳ Uploading and analyzing your lung sound...");

//       const res = await fetch("http://127.0.0.1:8000/upload_audio", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Server error while uploading.");

//       const data = await res.json();
//       setMessage("✅ File processed successfully!");
//       setPrediction(data.prediction || "No prediction received.");
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error: Could not upload or process the audio.");
//       setPrediction("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
//       {/* 🔹 Navbar */}
//       <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
//         <h1
//           onClick={() => navigate("/")}
//           className="text-xl font-bold cursor-pointer hover:text-gray-200"
//         >
//           🩺 Patient Dashboard
//         </h1>
//         <button
//           onClick={() => navigate("/patient/profile")}
//           className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition duration-300"
//         >
//           My Profile
//         </button>
//       </nav>

//       {/* 🔹 Main Section */}
//       <div className="flex-grow flex flex-col items-center justify-center p-6">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
//           <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
//             🎧 Upload & Analyze Your Lung Sound
//           </h1>

//           {/* Instructions */}
//           <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg mb-6">
//             <h2 className="text-lg font-semibold text-indigo-700 mb-2">
//               🩺 Recording Tips:
//             </h2>
//             <ul className="list-disc ml-6 text-gray-700 space-y-1">
//               <li>Record in a quiet environment with minimal background noise.</li>
//               <li>Use a high-quality microphone or stethoscope-mic.</li>
//               <li>Hold mic 1–2 cm away from your chest or back.</li>
//               <li>Take slow, deep breaths for about 10 seconds.</li>
//               <li>Save in <b>.wav</b> format.</li>
//             </ul>
//           </div>

//           {/* Upload Form */}
//           <form
//             onSubmit={handleUpload}
//             className="flex flex-col items-center justify-center space-y-4"
//           >
//             <label className="block text-gray-700 font-semibold">
//               Upload your recorded lung sound (.wav):
//             </label>
//             <input
//               type="file"
//               accept=".wav"
//               onChange={handleFileChange}
//               className="border border-gray-300 rounded-lg p-2 w-full max-w-md focus:ring-2 focus:ring-indigo-400"
//               required
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className={`${
//                 loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
//               } text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300`}
//             >
//               {loading ? "Processing..." : "Upload & Analyze"}
//             </button>
//           </form>

//           {/* Messages */}
//           {message && (
//             <p className="mt-6 text-center text-gray-700 font-medium">
//               {message}
//             </p>
//           )}

//           {/* Prediction Result */}
//           {prediction && (
//             <div className="mt-6 text-center bg-green-50 border border-green-300 rounded-lg p-4">
//               <h3 className="text-xl font-semibold text-green-700">
//                 🩻 Model Prediction:
//               </h3>
//               <p className="text-lg text-gray-800 mt-2">{prediction}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Patient;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Patient = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showConnectButton, setShowConnectButton] = useState(false); // 🔹 new state
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setMessage("");
//     setPrediction("");
//     setShowConnectButton(false); // reset if new file is chosen
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setMessage("⚠️ Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("user_id", localStorage.getItem("user_id")); // optional if backend needs it

//     try {
//       setLoading(true);
//       setMessage("⏳ Uploading and analyzing your lung sound...");

//       const res = await fetch("http://127.0.0.1:8000/upload_audio", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Server error while uploading.");

//       const data = await res.json();
//       setMessage("✅ File processed successfully!");
//       setPrediction(data.prediction || "No prediction received.");

//       // 🔹 show "Connect to Doctor" only if NOT healthy
//       if (data.prediction && data.prediction.toLowerCase() !== "healthy") {
//         setShowConnectButton(true);
//       } else {
//         setShowConnectButton(false);
//       }

//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error: Could not upload or process the audio.");
//       setPrediction("");
//       setShowConnectButton(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConnectToDoctor = () => {
//     navigate("/connect-doctor"); // 🔹 navigate to connect doctor page
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
//       {/* 🔹 Navbar */}
//       <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
//         <h1
//           onClick={() => navigate("/")}
//           className="text-xl font-bold cursor-pointer hover:text-gray-200"
//         >
//           🩺 Patient Dashboard
//         </h1>
//         <button
//           onClick={() => navigate("/patient/profile")}
//           className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition duration-300"
//         >
//           My Profile
//         </button>
//       </nav>

//       {/* 🔹 Main Section */}
//       <div className="flex-grow flex flex-col items-center justify-center p-6">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
//           <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
//             🎧 Upload & Analyze Your Lung Sound
//           </h1>

//           {/* Instructions */}
//           <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg mb-6">
//             <h2 className="text-lg font-semibold text-indigo-700 mb-2">
//               🩺 Recording Tips:
//             </h2>
//             <ul className="list-disc ml-6 text-gray-700 space-y-1">
//               <li>Record in a quiet environment with minimal background noise.</li>
//               <li>Use a high-quality microphone or stethoscope-mic.</li>
//               <li>Hold mic 1–2 cm away from your chest or back.</li>
//               <li>Take slow, deep breaths for about 10 seconds.</li>
//               <li>Save in <b>.wav</b> format.</li>
//             </ul>
//           </div>

//           {/* Upload Form */}
//           <form
//             onSubmit={handleUpload}
//             className="flex flex-col items-center justify-center space-y-4"
//           >
//             <label className="block text-gray-700 font-semibold">
//               Upload your recorded lung sound (.wav):
//             </label>
//             <input
//               type="file"
//               accept=".wav"
//               onChange={handleFileChange}
//               className="border border-gray-300 rounded-lg p-2 w-full max-w-md focus:ring-2 focus:ring-indigo-400"
//               required
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className={`${
//                 loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
//               } text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300`}
//             >
//               {loading ? "Processing..." : "Upload & Analyze"}
//             </button>
//           </form>

//           {/* Messages */}
//           {message && (
//             <p className="mt-6 text-center text-gray-700 font-medium">
//               {message}
//             </p>
//           )}

//           {/* Prediction Result */}
//           {prediction && (
//             <div className="mt-6 text-center bg-green-50 border border-green-300 rounded-lg p-4">
//               <h3 className="text-xl font-semibold text-green-700">
//                 🩻 Model Prediction:
//               </h3>
//               <p className="text-lg text-gray-800 mt-2">{prediction}</p>
//             </div>
//           )}

//           {/* 🔹 Connect to Doctor Button (Only if not Healthy) */}
//           {showConnectButton && (
//             <div className="mt-6 flex justify-center">
//               <button
//                 onClick={handleConnectToDoctor}
//                 className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
//               >
//                 👨‍⚕️ Connect to Doctor
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Patient;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Patient = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showConnectButton, setShowConnectButton] = useState(false);
//   const [connectedDoctor, setConnectedDoctor] = useState(null);
//   const [connectionType, setConnectionType] = useState(""); // 🔹 new: urgent/regular
//   const [connecting, setConnecting] = useState(false); // 🔹 new: loader for connect
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setMessage("");
//     setPrediction("");
//     setShowConnectButton(false);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setMessage("⚠️ Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("user_id", localStorage.getItem("user_id"));

//     try {
//       setLoading(true);
//       setMessage("⏳ Uploading and analyzing your lung sound...");

//       const res = await fetch("http://127.0.0.1:8000/upload_audio", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Server error while uploading.");

//       const data = await res.json();
//       setMessage("✅ File processed successfully!");
//       setPrediction(data.prediction || "No prediction received.");

//       if (data.prediction && data.prediction.toLowerCase() !== "healthy") {
//         setShowConnectButton(true);
//       } else {
//         setShowConnectButton(false);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error: Could not upload or process the audio.");
//       setPrediction("");
//       setShowConnectButton(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Handle connecting to a doctor
//   const handleConnectToDoctor = async (type) => {
//     setConnectionType(type);
//     setConnecting(true);
//     setMessage("");

//     try {
//     // ✅ Get patient ID (same as user_id if 1:1 mapping)
//     const patientId = localStorage.getItem("patient_id") || localStorage.getItem("user_id");

//     // ✅ Prepare payload expected by backend
//     const payload = {
//       patient_id: patientId,
//       urgent: type === "urgent", // convert to True/False
//       doctor_id: null, // backend will ignore this for urgent
//     };

//     const res = await fetch("http://127.0.0.1:8000/connect_doctor", {
//       // 👈 Ensure port matches your Flask server (check console output)
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) throw new Error("Failed to connect to doctor.");

//     const data = await res.json();
//     setMessage(`✅ ${data.message} — Dr. ${data.doctor}`);


//     if (data.appointment_id) {
//   // ✅ Store appointment info so user can open chat manually
//     setMessage(`✅ ${data.message} — Dr. ${data.doctor}`);
//     setConnectedDoctor({
//     doctorName: data.doctor,
//     appointmentId: data.appointment_id,
//     connectionType: type,
//     patientId: patientId,
//   });
// }


    
//   } catch (error) {
//     console.error(error);
//     setMessage("❌ Error: Unable to connect to a doctor right now.");
//   } finally {
//     setConnecting(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
//       {/* 🔹 Navbar */}
//       <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
//         <h1
//           onClick={() => navigate("/")}
//           className="text-xl font-bold cursor-pointer hover:text-gray-200"
//         >
//           🩺 Patient Dashboard
//         </h1>
//         <button
//           onClick={() => navigate("/patient/profile")}
//           className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition duration-300"
//         >
//           My Profile
//         </button>
//       </nav>

//       {/* 🔹 Main Section */}
//       <div className="flex-grow flex flex-col items-center justify-center p-6">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
//           <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
//             🎧 Upload & Analyze Your Lung Sound
//           </h1>

//           {/* Instructions */}
//           <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg mb-6">
//             <h2 className="text-lg font-semibold text-indigo-700 mb-2">
//               🩺 Recording Tips:
//             </h2>
//             <ul className="list-disc ml-6 text-gray-700 space-y-1">
//               <li>Record in a quiet environment with minimal background noise.</li>
//               <li>Use a high-quality microphone or stethoscope-mic.</li>
//               <li>Hold mic 1–2 cm away from your chest or back.</li>
//               <li>Take slow, deep breaths for about 10 seconds.</li>
//               <li>Save in <b>.wav</b> format.</li>
//             </ul>
//           </div>

//           {/* Upload Form */}
//           <form
//             onSubmit={handleUpload}
//             className="flex flex-col items-center justify-center space-y-4"
//           >
//             <label className="block text-gray-700 font-semibold">
//               Upload your recorded lung sound (.wav):
//             </label>
//             <input
//               type="file"
//               accept=".wav"
//               onChange={handleFileChange}
//               className="border border-gray-300 rounded-lg p-2 w-full max-w-md focus:ring-2 focus:ring-indigo-400"
//               required
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className={`${
//                 loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
//               } text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300`}
//             >
//               {loading ? "Processing..." : "Upload & Analyze"}
//             </button>
//           </form>

//           {/* Messages */}
//           {message && (
//             <p className="mt-6 text-center text-gray-700 font-medium">
//               {message}
//             </p>
//           )}

//           {/* Prediction Result */}
//           {prediction && (
//             <div className="mt-6 text-center bg-green-50 border border-green-300 rounded-lg p-4">
//               <h3 className="text-xl font-semibold text-green-700">
//                 🩻 Model Prediction:
//               </h3>
//               <p className="text-lg text-gray-800 mt-2">{prediction}</p>
//             </div>
//           )}

//           {/* 🔹 Connect to Doctor Buttons */}
//           {showConnectButton && (
//             <div className="mt-6 flex flex-col items-center space-y-3">
//               <p className="text-gray-700 font-semibold text-center">
//                 Your condition requires medical attention.
//                 <br /> Choose how you want to connect:
//               </p>

//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => handleConnectToDoctor("regular")}
//                   disabled={connecting}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
//                 >
//                   👨‍⚕️ Connect to Regular Doctor
//                 </button>

//                 <button
//                   onClick={() => handleConnectToDoctor("urgent")}
//                   disabled={connecting}
//                   className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
//                 >
//                   🚨 Urgent — Any Available Doctor
//                 </button>
//               </div>

//               {connecting && (
//                 <p className="text-sm text-gray-500 mt-2">
//                   Connecting to a doctor, please wait...
//                 </p>
//               )}
//             </div>
//           )}
//           {connectedDoctor && (
//   <button
//     onClick={() =>
//       navigate(`/chatroom/${connectedDoctor.appointmentId}`, {
//         state: connectedDoctor,
//       })
//     }
//     className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
//   >
    
//     💬 Open Chat Room
//   </button>
// )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Patient;





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CloudArrowUpIcon, 
  InformationCircleIcon, 
  MicrophoneIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpTrayIcon,
  SpeakerWaveIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const Patient = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  // const [showConnectButton, setShowConnectButton] = useState(false);
  const [connectedDoctor, setConnectedDoctor] = useState(null);
  // const [connecting, setConnecting] = useState(false);
  const [doctors, setDoctors] = useState([]);
const [selectedDoctor, setSelectedDoctor] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setPrediction("");
    setDoctors([]);
    setSelectedDoctor(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", localStorage.getItem("user_id"));

    try {
      setLoading(true);
      setMessage("⏳ Analyzing your respiratory patterns...");
      const res = await fetch("http://127.0.0.1:8000/upload_audio", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error.");
      const data = await res.json();
      
      setPrediction(data.prediction || "No prediction received.");
      if (data.prediction?.toLowerCase() !== "healthy") {
        const patientId = localStorage.getItem("user_id");

        const docRes = await fetch(
         `http://127.0.0.1:8000/available_doctors/${patientId}`
        );

        const docData = await docRes.json();

        if (Array.isArray(docData)) {
        setDoctors(docData);
        }

      }
    } catch (err) {
      setMessage("❌ Error: Could not process the audio.");
    } finally {
      setLoading(false);
    }
  };

  // const handleConnectToDoctor = async (type) => {
  //   setConnecting(true);
  //   try {
  //     const patientId = localStorage.getItem("patient_id") || localStorage.getItem("user_id");
  //     const res = await fetch("http://127.0.0.1:8000/connect", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ patient_id: patientId, urgent: type === "urgent" }),
  //     });

  //     const data = await res.json();
  //     if (data.appointment_id) {
  //       setConnectedDoctor({
  //         doctorName: data.doctor,
  //         appointmentId: data.appointment_id,
  //         connectionType: type,
  //       });
  //     }
  //   } catch (error) {
  //     setMessage("❌ Unable to connect to a doctor.");
  //   } finally {
  //     setConnecting(false);
  //   }
  // };
  const handleConnectToDoctor = async () => {
  if (!selectedDoctor) {
    alert("Please select a doctor first.");
    return;
  }

  try {
    const patientId = localStorage.getItem("user_id");

    const res = await fetch("http://127.0.0.1:8000/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctor_id: selectedDoctor.doctor_user_id,
        patient_id: patientId
      }),
    });

    const data = await res.json();

    if (data.appointment_id) {
      navigate(`/chatroom/${data.appointment_id}`);
    }
  } catch (error) {
    console.error("Connection failed:", error);
  }
};


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <MicrophoneIcon className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">RespiCheck AI</span>
        </div>
        <button 
          onClick={() => navigate("/patient/profile")}
          className="bg-slate-100 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
        >
          My Profile
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-4 lg:p-10">
        
        {/* --- INSTRUCTIONS SECTION --- */}
        <section className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">How to Use RespiCheck</h2>
            <p className="text-slate-500">Follow these 3 simple steps to get your lung health analysis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                <MicrophoneIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Record Audio</h3>
              <p className="text-sm text-slate-500 mb-4">Record 10 seconds of deep breathing in a silent room.</p>
              {/* Visual Aid Placeholder */}
              <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-dashed border-slate-300 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-slate-400 absolute top-2">Visual Guide: Recording</span>
                <div className="flex flex-col items-center">
                   <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-1">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                   </div>
                   <p className="text-[10px] text-slate-400 italic font-medium text-center px-4">Hold phone 2cm from chest</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <ArrowUpTrayIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Upload .WAV</h3>
              <p className="text-sm text-slate-500 mb-4">Click the box below to select your file from your device.</p>
              {/* Visual Aid Placeholder */}
              <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-dashed border-slate-300 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-slate-400 absolute top-2">Visual Guide: Interface</span>
                <div className="w-20 h-14 bg-white rounded border border-slate-200 shadow-sm flex items-center justify-center">
                   <div className="w-10 h-2 bg-indigo-100 rounded"></div>
                </div>
                <div className="absolute bottom-4 right-4 animate-bounce">
                   <div className="bg-indigo-600 p-1 rounded text-white"><ArrowUpTrayIcon className="h-4 w-4"/></div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                <ShieldCheckIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Get Results</h3>
              <p className="text-sm text-slate-500 mb-4">Our AI analyzes patterns and provides instant feedback.</p>
              {/* Visual Aid Placeholder */}
              <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-dashed border-slate-300 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-slate-400 absolute top-2">Visual Guide: Results</span>
                <div className="flex gap-1 items-end">
                    <div className="w-1 h-4 bg-indigo-300"></div>
                    <div className="w-1 h-8 bg-indigo-400"></div>
                    <div className="w-1 h-12 bg-indigo-600"></div>
                    <div className="w-1 h-6 bg-indigo-300"></div>
                </div>
                <div className="ml-4 bg-white px-2 py-1 rounded shadow-sm border border-green-100">
                    <p className="text-[10px] font-bold text-green-600">Healthy ✅</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- MAIN ACTION AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Detailed Guide */}
          <div className="lg:col-span-1">
            <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl sticky top-24">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <InformationCircleIcon className="h-6 w-6 text-indigo-300" />
                Pro Recording Tips
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <SpeakerWaveIcon className="h-6 w-6 text-indigo-300 shrink-0" />
                  <div>
                    <p className="font-semibold italic text-indigo-100 text-sm">Silence is Key</p>
                    <p className="text-indigo-200 text-xs mt-1">Background noise like TV, fans, or traffic can confuse the AI.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-6 w-6 rounded border-2 border-indigo-300 flex items-center justify-center shrink-0 font-bold text-xs">WAV</div>
                  <div>
                    <p className="font-semibold italic text-indigo-100 text-sm">Save as .WAV</p>
                    <p className="text-indigo-200 text-xs mt-1">If your phone saves as .m4a or .mp3, use an online converter to get a .wav file.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 shrink-0" />
                  <div>
                    <p className="font-semibold italic text-indigo-100 text-sm">Hold Steady</p>
                    <p className="text-indigo-200 text-xs mt-1">Avoid rubbing the microphone against your clothes or skin while recording.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Analysis & Upload */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upload Area */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <form onSubmit={handleUpload} className="space-y-6">
                <label className="block">
                  <span className="text-slate-700 font-bold text-lg mb-2 block">Upload Recording</span>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-12 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group text-center cursor-pointer">
                    <input
                      type="file"
                      accept=".wav"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <CloudArrowUpIcon className="h-16 w-16 text-slate-300 mx-auto mb-4 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-slate-600 font-bold text-xl">
                      {file ? file.name : "Choose file or drag here"}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">Maximum file size: 10MB (WAV format only)</p>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading || !file}
                  className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl transition-all transform active:scale-[0.98] ${
                    loading || !file ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      AI is Analyzing...
                    </span>
                  ) : "Run AI Health Check"}
                </button>
              </form>

              {message && (
                <div className={`mt-6 p-4 rounded-xl text-sm font-medium text-center ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-50 text-slate-600'}`}>
                  {message}
                </div>
              )}
            </div>

            {/* Results Section */}
            {prediction && (
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MicrophoneIcon className="h-24 w-24" />
                 </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Diagnostic Result</h3>
                    <p className={`text-5xl font-black mt-2 ${prediction.toLowerCase() === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                      {prediction}
                    </p>
                  </div>
                  {prediction.toLowerCase() === 'healthy' ? (
                    <div className="bg-green-100 p-4 rounded-full"><CheckCircleIcon className="h-16 w-16 text-green-600" /></div>
                  ) : (
                    <div className="bg-red-100 p-4 rounded-full"><ExclamationTriangleIcon className="h-16 w-16 text-red-600" /></div>
                  )}
                </div>

                {/* {showConnectButton && !connectedDoctor && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-6">
                        <p className="text-amber-800 text-sm font-semibold text-center">
                           Note: This AI screening is not a replacement for medical diagnosis. Please consult a doctor.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleConnectToDoctor("urgent")}
                        className="p-5 bg-red-600 rounded-2xl hover:bg-red-700 transition-all text-white font-bold shadow-lg shadow-red-200"
                      >
                        🚨 Urgent Connect
                      </button>
                    </div>
                  </div>
                )} */}
                {prediction && (
  <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
    
    {/* Result Display */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      ...
    </div>

    {/* 👇 PLACE DOCTOR LIST HERE */}
    {doctors.length > 0 && (
      <div className="mt-8 pt-8 border-t border-slate-100">
        <h3 className="font-bold mb-4 text-lg">Available Doctors</h3>

        {doctors.map((doc) => (
          <div
            key={doc.doctor_user_id}
            onClick={() => setSelectedDoctor(doc)}
            className={`p-4 border rounded-xl cursor-pointer mb-2 transition ${
              selectedDoctor?.doctor_user_id === doc.doctor_user_id
                ? "border-indigo-600 bg-indigo-50"
                : "hover:border-indigo-300"
            }`}
          >
            <p className="font-semibold">{doc.name}</p>
            <p className="text-sm text-gray-500">{doc.specialization}</p>
          </div>
        ))}

        <button
          onClick={handleConnectToDoctor}
          className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl"
        >
          Connect Selected Doctor
        </button>
      </div>
    )}
  </div>
)}


                {connectedDoctor && (
                  <div className="mt-8">
                    <button
                      onClick={() => navigate(`/chatroom/${connectedDoctor.appointmentId}`, { state: connectedDoctor })}
                      className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1"
                    >
                      <ChatBubbleLeftRightIcon className="h-6 w-6" />
                      Enter Chat with Dr. {connectedDoctor.doctorName}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Patient;
