import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [reportFile, setReportFile] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/profile/${userId}`
          // `https://rhms-b9d9.onrender.com/profile/${userId}`
        );
        setPatient(response.data);
      } catch (err) {
        setError("Failed to load patient profile");
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    try {
      await axios.put("http://127.0.0.1:8000/profile/update", {
      // await axios.put("https://rhms-b9d9.onrender.com/profile/update", {
        user_id: userId,
        name: patient.name,
        age: patient.age,
        // gender: patient.gender,
        previous_history: patient.previous_history,
      });

      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleReportUpload = async () => {
    if (!reportFile) {
      alert("Select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", reportFile);
    formData.append("user_id", userId);

    try {
      await axios.post(
        "http://127.0.0.1:8000/upload_report",
        // "https://rhms-b9d9.onrender.com/upload_report",
        formData
      );
      alert("Report uploaded successfully");
    } catch (err) {
      alert("Upload failed");
    }
  };

  if (error)
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!patient)
    return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-6">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700">
              {patient.name}
            </h2>
            <p className="text-gray-500">
              AI Prediction:{" "}
              <span className="font-semibold text-indigo-600">
                {patient.model_output || "N/A"}
              </span>
            </p>
          </div>

          <div className="space-x-3">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="mt-6 space-y-4">
          <div>
            <strong>Email:</strong> {patient.email}
          </div>

          <div>
            <strong>Name:</strong>{" "}
            {editMode ? (
              <input
                className="border p-2 rounded ml-2"
                value={patient.name}
                onChange={(e) =>
                  setPatient({ ...patient, name: e.target.value })
                }
              />
            ) : (
              patient.name
            )}
          </div>

          <div>
            <strong>Age:</strong>{" "}
            {editMode ? (
              <input
                type="number"
                className="border p-2 rounded ml-2"
                value={patient.age || ""}
                onChange={(e) =>
                  setPatient({ ...patient, age: e.target.value })
                }
              />
            ) : (
              patient.age
            )}
          </div>

          {/* <div>
            <strong>Gender:</strong>{" "}
            {editMode ? (
              <select
                className="border p-2 rounded ml-2"
                value={patient.gender || ""}
                onChange={(e) =>
                  setPatient({ ...patient, gender: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              patient.gender || "N/A"
            )}
          </div> */}

          <div>
            <strong>Previous Respiratory History:</strong>
            {editMode ? (
              <textarea
                className="border p-2 rounded w-full mt-2"
                rows="3"
                value={patient.previous_history || ""}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    previous_history: e.target.value,
                  })
                }
              />
            ) : (
              <p className="mt-2 text-gray-600">
                {patient.previous_history || "No history provided"}
              </p>
            )}
          </div>
        </div>

        {/* DIAGNOSIS HISTORY TABLE */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">
            Medical Condition History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">AI Prediction</th>
                  <th className="p-3 border">Doctor Diagnosis</th>
                  <th className="p-3 border">Prescription</th>
                </tr>
              </thead>
              <tbody>
                {patient.diagnosis_history &&
                patient.diagnosis_history.length > 0 ? (
                  patient.diagnosis_history.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="p-3 border">{item.date}</td>
                      <td className="p-3 border">
                        {patient.model_output}
                      </td>
                      <td className="p-3 border">
                        {item.disease}
                      </td>
                      <td className="p-3 border">
                        {item.prescription}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500"
                    >
                      No consultations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MEDICAL REPORT UPLOAD */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">
            Upload Medical Reports
          </h3>

          <div className="flex gap-4">
            <input
              type="file"
              onChange={(e) =>
                setReportFile(e.target.files[0])
              }
              className="border p-2 rounded"
            />
            <button
              onClick={handleReportUpload}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Upload
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientProfile;
