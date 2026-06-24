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
      // const res = await fetch("https://rhms-b9d9.onrender.com/upload_audio", {
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
        // `https://rhms-b9d9.onrender.com/available_doctors/${patientId}`
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
  const handleConnectToDoctor = async () => {
  if (!selectedDoctor) {
    alert("Please select a doctor first.");
    return;
  }

  try {
    const patientId = localStorage.getItem("user_id");

    const res = await fetch("http://127.0.0.1:8000/connect", {
    // const res = await fetch("https://rhms-b9d9.onrender.com/connect", {
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
