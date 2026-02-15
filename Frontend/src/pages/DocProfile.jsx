import React, { useEffect, useState } from "react";
import axios from "axios";

const DocProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/doctor/profile/${userId}`
      );
      setDoctor(response.data);
    } catch (err) {
      setError("Failed to load doctor profile");
    }
  };

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/doctor/profile/update",
        {
          user_id: userId,
          ...doctor,
        }
      );

      setMessage("Profile updated successfully ✅");
      setEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (error)
    return <p className="text-center text-red-500 mt-8">{error}</p>;

  if (!doctor)
    return <p className="text-center mt-8">Loading...</p>;

  // return (
  //   <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex justify-center items-center p-6">
  //     <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">

  //       {/* Header */}
  //       <div className="flex flex-col md:flex-row items-center border-b pb-6">
  //         <img
  //           src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
  //           alt="Doctor Profile"
  //           className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
  //         />

  //         <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left w-full">
  //           {editing ? (
  //             <input
  //               type="text"
  //               name="name"
  //               value={doctor.name}
  //               onChange={handleChange}
  //               className="border p-2 rounded w-full"
  //             />
  //           ) : (
  //             <h2 className="text-2xl font-semibold text-blue-700">
  //               Dr. {doctor.name}
  //             </h2>
  //           )}

  //           {editing ? (
  //             <input
  //               type="text"
  //               name="specialization"
  //               value={doctor.specialization}
  //               onChange={handleChange}
  //               className="border p-2 rounded w-full mt-2"
  //             />
  //           ) : (
  //             <p className="text-gray-600 text-lg">
  //               {doctor.specialization}
  //             </p>
  //           )}
  //         </div>
  //       </div>

  //       {/* Details Section */}
  //       <div className="mt-6 space-y-4">

  //         {/* Email */}
  //         <div>
  //           <strong>Email:</strong> {doctor.email}
  //         </div>

  //         {/* Age */}
  //         {/* <div>
  //           <strong>Age:</strong>{" "}
  //           {editing ? (
  //             <input
  //               type="number"
  //               name="age"
  //               value={doctor.age || ""}
  //               onChange={handleChange}
  //               className="border p-2 rounded w-32"
  //             />
  //           ) : (
  //             doctor.age
  //           )}
  //         </div> */}

  //         {/* Experience */}
  //         <div>
  //           <strong>Experience:</strong>{" "}
  //           {editing ? (
  //             <input
  //               type="number"
  //               name="experience"
  //               value={doctor.experience || ""}
  //               onChange={handleChange}
  //               className="border p-2 rounded w-32"
  //             />
  //           ) : (
  //             `${doctor.experience} years`
  //           )}
  //         </div>

  //         {/* Availability */}
  //         <div>
  //           <strong>Available From:</strong>{" "}
  //           {editing ? (
  //             <input
  //               type="time"
  //               name="available_from"
  //               value={doctor.available_from}
  //               onChange={handleChange}
  //               className="border p-2 rounded"
  //             />
  //           ) : (
  //             doctor.available_from
  //           )}
  //         </div>

  //         <div>
  //           <strong>Available To:</strong>{" "}
  //           {editing ? (
  //             <input
  //               type="time"
  //               name="available_to"
  //               value={doctor.available_to}
  //               onChange={handleChange}
  //               className="border p-2 rounded"
  //             />
  //           ) : (
  //             doctor.available_to
  //           )}
  //         </div>
  //       </div>

  //       {/* Buttons */}
  //       <div className="mt-8 flex justify-end gap-4">
  //         {editing ? (
  //           <>
  //             <button
  //               onClick={() => setEditing(false)}
  //               className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
  //             >
  //               Cancel
  //             </button>
  //             <button
  //               onClick={handleSave}
  //               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  //             >
  //               Save Changes
  //             </button>
  //           </>
  //         ) : (
  //           <button
  //             onClick={() => setEditing(true)}
  //             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  //           >
  //             Edit Profile
  //           </button>
  //         )}
  //       </div>

  //       {message && (
  //         <p className="text-green-600 mt-4 text-right">{message}</p>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-6">
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">

      {/* Top Banner */}
      <div className="bg-blue-600 h-32 relative">
        <div className="absolute -bottom-16 left-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
            alt="Doctor"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      <div className="pt-20 px-8 pb-8">

        {/* Name + Specialization */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            {editing ? (
              <input
                type="text"
                name="name"
                value={doctor.name}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full text-xl font-semibold"
              />
            ) : (
              <h2 className="text-3xl font-bold text-gray-800">
                Dr. {doctor.name}
              </h2>
            )}

            {editing ? (
              <input
                type="text"
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full mt-2"
              />
            ) : (
              <p className="text-blue-600 text-lg font-medium mt-1">
                {doctor.specialization}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t"></div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Left Column */}
          <div className="bg-blue-50 p-5 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Professional Details
            </h3>

            <p className="mb-2">
              <strong>Email:</strong> {doctor.email}
            </p>

            <p className="mb-2">
              <strong>Experience:</strong>{" "}
              {editing ? (
                <input
                  type="number"
                  name="experience"
                  value={doctor.experience || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-24 ml-2"
                />
              ) : (
                `${doctor.experience} years`
              )}
            </p>
          </div>

          {/* Right Column */}
          <div className="bg-blue-50 p-5 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Availability
            </h3>

            <p className="mb-2">
              <strong>From:</strong>{" "}
              {editing ? (
                <input
                  type="time"
                  name="available_from"
                  value={doctor.available_from}
                  onChange={handleChange}
                  className="border p-1 rounded ml-2"
                />
              ) : (
                doctor.available_from
              )}
            </p>

            <p>
              <strong>To:</strong>{" "}
              {editing ? (
                <input
                  type="time"
                  name="available_to"
                  value={doctor.available_to}
                  onChange={handleChange}
                  className="border p-1 rounded ml-2"
                />
              ) : (
                doctor.available_to
              )}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-5 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <p className="text-green-600 mt-4 text-right font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  </div>
);

};

export default DocProfile;
