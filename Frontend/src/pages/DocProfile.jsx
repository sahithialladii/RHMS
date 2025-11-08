// import React from "react";

// const DocProfile = () => {
//   const doctor = {
//     name: "Dr. Priya Sharma",
//     specialization: "Pulmonologist (Respiratory Specialist)",
//     email: "priya.sharma@medicare.com",
//     phone: "+91 98765 43210",
//     experience: "10 years",
//     location: "Apollo Hospitals, Hyderabad",
//     about:
//       "Dr. Priya Sharma is a board-certified pulmonologist with over a decade of experience in diagnosing and managing respiratory conditions. She specializes in AI-assisted lung sound analysis and early disease detection.",
//     profileImage:
//       "https://cdn-icons-png.flaticon.com/512/387/387561.png", // Placeholder image
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex justify-center items-center p-6">
//       <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8">
//         {/* Profile Header */}
//         <div className="flex flex-col md:flex-row items-center border-b pb-6">
//           <img
//             src={doctor.profileImage}
//             alt="Doctor Profile"
//             className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
//           />
//           <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
//             <h2 className="text-2xl font-semibold text-blue-700">{doctor.name}</h2>
//             <p className="text-gray-600 text-lg">{doctor.specialization}</p>
//             <p className="text-sm text-gray-500 mt-1">{doctor.location}</p>
//           </div>
//         </div>

//         {/* Profile Info */}
//         <div className="mt-6 space-y-3">
//           <div>
//             <h3 className="font-semibold text-gray-700">Experience:</h3>
//             <p className="text-gray-600">{doctor.experience}</p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-700">Email:</h3>
//             <p className="text-gray-600">{doctor.email}</p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-700">Phone:</h3>
//             <p className="text-gray-600">{doctor.phone}</p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-700">About:</h3>
//             <p className="text-gray-600">{doctor.about}</p>
//           </div>
//         </div>

//         {/* Edit Button */}
//         <div className="mt-8 flex justify-end">
//           <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition">
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocProfile;



import React, { useEffect, useState } from "react";
import axios from "axios";

const DocProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/profile/${userId}`);
        setDoctor(response.data);
      } catch (err) {
        setError("Failed to load doctor profile");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!doctor) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8">
        <div className="flex flex-col md:flex-row items-center border-b pb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
            alt="Doctor Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
          />
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-blue-700">{doctor.name}</h2>
            <p className="text-gray-600 text-lg">{doctor.specialization}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Experience:</strong> {doctor.experience} years</p>
        </div>
      </div>
    </div>
  );
};

export default DocProfile;

