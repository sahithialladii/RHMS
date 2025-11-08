import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConnectDoctor = () => {
  const navigate = useNavigate();
  const patientUserId = localStorage.getItem("user_id"); // assume login saved user id
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!patientUserId) return;
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/available_doctors_for_patient/${patientUserId}`);
        setDoctors(res.data.doctors || []);
      } catch (err) {
        console.error(err);
        setMsg("Could not fetch doctors.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [patientUserId]);

  const handleConnect = async () => {
    if (!selected) { setMsg("Select a doctor first."); return; }
    try {
      const res = await axios.post("http://127.0.0.1:8000/connect_doctor", {
        patient_user_id: Number(patientUserId),
        doctor_profile_id: selected
      });
      setMsg(res.data.message || "Connected.");
      // optionally redirect to patient profile or show doctor details
      setTimeout(() => navigate("/patient/profile"), 1200);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.error || "Connection failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
        <h2 className="text-xl font-semibold mb-4">Choose a Doctor to Connect</h2>

        {loading ? <p>Loading doctors...</p> : (
          <>
            {doctors.length === 0 ? <p>No doctors available now.</p> : (
              <ul className="space-y-3">
                {doctors.map((d) => (
                  <li key={d.doctor_id} className={`p-3 border rounded ${selected === d.doctor_id ? 'bg-indigo-50 border-indigo-300' : ''}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="doctor" value={d.doctor_id}
                             checked={selected === d.doctor_id}
                             onChange={() => setSelected(d.doctor_id)} />
                      <div>
                        <div className="font-semibold">{d.name} {d.is_regular ? "(Your regular doctor)" : ""}</div>
                        <div className="text-sm text-gray-600">{d.specialization}</div>
                        <div className="text-sm text-gray-600">Availability: {d.available_from} - {d.available_to}</div>
                        <div className="text-sm text-gray-600">Current load: {d.current_patients}/{d.max_patients}</div>
                        {!d.connectable_now && <div className="text-xs text-red-500">Not connectable now</div>}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex gap-3">
              <button onClick={handleConnect} className="bg-indigo-600 text-white px-4 py-2 rounded">Connect</button>
              <button onClick={() => navigate(-1)} className="px-4 py-2 rounded border">Cancel</button>
            </div>
            {msg && <p className="mt-3 text-sm">{msg}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectDoctor;
