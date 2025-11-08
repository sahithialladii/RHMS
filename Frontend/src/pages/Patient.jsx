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





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Patient = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [connectedDoctor, setConnectedDoctor] = useState(null);
  const [connectionType, setConnectionType] = useState(""); // 🔹 new: urgent/regular
  const [connecting, setConnecting] = useState(false); // 🔹 new: loader for connect
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setPrediction("");
    setShowConnectButton(false);
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
      setMessage("⏳ Uploading and analyzing your lung sound...");

      const res = await fetch("http://127.0.0.1:8000/upload_audio", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error while uploading.");

      const data = await res.json();
      setMessage("✅ File processed successfully!");
      setPrediction(data.prediction || "No prediction received.");

      if (data.prediction && data.prediction.toLowerCase() !== "healthy") {
        setShowConnectButton(true);
      } else {
        setShowConnectButton(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error: Could not upload or process the audio.");
      setPrediction("");
      setShowConnectButton(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle connecting to a doctor
  const handleConnectToDoctor = async (type) => {
    setConnectionType(type);
    setConnecting(true);
    setMessage("");

    try {
    // ✅ Get patient ID (same as user_id if 1:1 mapping)
    const patientId = localStorage.getItem("patient_id") || localStorage.getItem("user_id");

    // ✅ Prepare payload expected by backend
    const payload = {
      patient_id: patientId,
      urgent: type === "urgent", // convert to True/False
      doctor_id: null, // backend will ignore this for urgent
    };

    const res = await fetch("http://127.0.0.1:8000/connect_doctor", {
      // 👈 Ensure port matches your Flask server (check console output)
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to connect to doctor.");

    const data = await res.json();
    setMessage(`✅ ${data.message} — Dr. ${data.doctor}`);


    if (data.appointment_id) {
  // ✅ Store appointment info so user can open chat manually
    setMessage(`✅ ${data.message} — Dr. ${data.doctor}`);
    setConnectedDoctor({
    doctorName: data.doctor,
    appointmentId: data.appointment_id,
    connectionType: type,
    patientId: patientId,
  });
}


    
  } catch (error) {
    console.error(error);
    setMessage("❌ Error: Unable to connect to a doctor right now.");
  } finally {
    setConnecting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* 🔹 Navbar */}
      <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer hover:text-gray-200"
        >
          🩺 Patient Dashboard
        </h1>
        <button
          onClick={() => navigate("/patient/profile")}
          className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition duration-300"
        >
          My Profile
        </button>
      </nav>

      {/* 🔹 Main Section */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8">
          <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
            🎧 Upload & Analyze Your Lung Sound
          </h1>

          {/* Instructions */}
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">
              🩺 Recording Tips:
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Record in a quiet environment with minimal background noise.</li>
              <li>Use a high-quality microphone or stethoscope-mic.</li>
              <li>Hold mic 1–2 cm away from your chest or back.</li>
              <li>Take slow, deep breaths for about 10 seconds.</li>
              <li>Save in <b>.wav</b> format.</li>
            </ul>
          </div>

          {/* Upload Form */}
          <form
            onSubmit={handleUpload}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <label className="block text-gray-700 font-semibold">
              Upload your recorded lung sound (.wav):
            </label>
            <input
              type="file"
              accept=".wav"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg p-2 w-full max-w-md focus:ring-2 focus:ring-indigo-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300`}
            >
              {loading ? "Processing..." : "Upload & Analyze"}
            </button>
          </form>

          {/* Messages */}
          {message && (
            <p className="mt-6 text-center text-gray-700 font-medium">
              {message}
            </p>
          )}

          {/* Prediction Result */}
          {prediction && (
            <div className="mt-6 text-center bg-green-50 border border-green-300 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-green-700">
                🩻 Model Prediction:
              </h3>
              <p className="text-lg text-gray-800 mt-2">{prediction}</p>
            </div>
          )}

          {/* 🔹 Connect to Doctor Buttons */}
          {showConnectButton && (
            <div className="mt-6 flex flex-col items-center space-y-3">
              <p className="text-gray-700 font-semibold text-center">
                Your condition requires medical attention.
                <br /> Choose how you want to connect:
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleConnectToDoctor("regular")}
                  disabled={connecting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
                >
                  👨‍⚕️ Connect to Regular Doctor
                </button>

                <button
                  onClick={() => handleConnectToDoctor("urgent")}
                  disabled={connecting}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
                >
                  🚨 Urgent — Any Available Doctor
                </button>
              </div>

              {connecting && (
                <p className="text-sm text-gray-500 mt-2">
                  Connecting to a doctor, please wait...
                </p>
              )}
            </div>
          )}
          {connectedDoctor && (
  <button
    onClick={() =>
      navigate(`/chatroom/${connectedDoctor.appointmentId}`, {
        state: connectedDoctor,
      })
    }
    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
  >
    💬 Open Chat Room
  </button>
)}

        </div>
      </div>
    </div>
  );
};

export default Patient;
