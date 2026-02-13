// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("http://127.0.0.1:8000");

// const ChatRoom = ({ appointmentId, user }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     socket.emit("join", { appointment_id: appointmentId, user_name: user.name });

//     socket.on("receive_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     socket.on("system_message", (data) => {
//       setMessages((prev) => [...prev, { message: data.message, system: true }]);
//     });

//     return () => socket.disconnect();
//   }, [appointmentId]);

//   const sendMessage = () => {
//     if (input.trim() !== "") {
//       socket.emit("send_message", {
//         appointment_id: appointmentId,
//         sender_id: user.user_id,
//         message: input
//       });
//       setInput("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg rounded-lg">
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-lg ${
//               msg.system
//                 ? "text-gray-500 text-center text-sm"
//                 : msg.sender_id === user.user_id
//                 ? "bg-blue-100 self-end text-right"
//                 : "bg-gray-100 self-start text-left"
//             }`}
//           >
//             {msg.message}
//           </div>
//         ))}
//       </div>
//       <div className="p-2 flex border-t">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;



// import React, { useEffect, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import io from "socket.io-client";

// // ✅ Socket connection setup (keep this near the top of ChatRoom.jsx)
// const socket = io("http://127.0.0.1:8000", {
//   transports: ["websocket"],
//   autoConnect: false,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 2000,
// });


// // const socket = io("http://127.0.0.1:8000", {
// //   transports: ["websocket"], // ensures stable connection
// // });

// const ChatRoom = () => {
//   const { appointmentId } = useParams();
//   const location = useLocation();
//   const { doctorName, connectionType, patientId } = location.state || {};

//   // 🧠 Fetch role & name from localStorage
//   const role = localStorage.getItem("role"); // "doctor" or "patient"
//   const user = {
//     name: localStorage.getItem("user_name") || "Unknown",
//     user_id: localStorage.getItem("user_id"),
//   };

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//   if (!appointmentId) 
//     if (!appointmentId) {
//     console.log("❗ No appointmentId in params");
//     return;
//   }

//   // remove any old listeners to avoid duplicates
//   socket.off();
//   socket.connect();

//   socket.emit("join", {
//     appointment_id: appointmentId,
//     user_name: user.name,
//   });

//   socket.on("connect", () => {
//     console.log("🟢 Socket connected (client)", socket.id);
//     setConnected(true);
//     const payload = { appointment_id: appointmentId, user_name: user.name };
//     console.log("➡️ Emitting join with payload:", payload);
//     socket.emit("join", payload);
//   });

//   socket.on("system_message", (data) => {
//     console.log("system_message received:", data);
//     setMessages((prev) => [...prev, { message: data.message, system: true }]);
//   });

//   socket.on("receive_message", (data) => {
//     console.log("receive_message received:", data);
//     setMessages((prev) => [...prev, data]);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("🔴 Socket disconnected (client):", reason);
//     setConnected(false);
//   });

//   // ❌ DON'T disconnect the socket on unmount, only remove listeners
//   return () => {
//     socket.off("connect");
//     socket.off("system_message");
//     socket.off("receive_message");
//     socket.off("disconnect");
//   };
// }, [appointmentId]);


//   // --- SEND MESSAGE ---
//   const sendMessage = () => {
//     if (input.trim() === "") return;

//     socket.emit("send_message", {
//       appointment_id: appointmentId,
//       sender_id: user.user_id,
//       sender_role: role,
//       message: input.trim(),
//     });
//     setInput("");
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg rounded-lg">
//       <div className="p-4 bg-indigo-600 text-white text-center font-bold rounded-t-lg">
//         {role === "doctor"
//           ? `💬 Chat with Patient`
//           : `💬 Chat with Dr. ${doctorName || "Unknown"}`}
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
//         {messages.length === 0 && (
//           <p className="text-gray-400 text-center mt-4 text-sm">
//             No messages yet. Start the conversation 👋
//           </p>
//         )}


//           {messages.map((msg, index) => (
//   <div
//     key={`${msg.sender_id || "sys"}-${msg.timestamp || Date.now()}-${index}`}
//     className={`p-2 max-w-[80%] rounded-lg ${
//       msg.system
//         ? "text-gray-500 text-center text-sm w-full"
//         : msg.sender_id === user.user_id
//         ? "bg-indigo-100 self-end ml-auto text-right"
//         : "bg-gray-200 self-start text-left"
//     }`}
//   >
//     {msg.message}
//   </div>
// ))}



//       </div>

//       <div className="p-3 flex border-t bg-white">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
//           placeholder={
//             connected ? "Type a message..." : "Connecting to chat..."
//           }
//           disabled={!connected}
//         />
//         <button
//           onClick={sendMessage}
//           disabled={!connected}
//           className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;






import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:8000", {
  transports: ["websocket"],
  autoConnect: false,
});

const ChatRoom = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  // const userId = localStorage.getItem("user_id");
  const currentUserId = Number(localStorage.getItem("user_id"));
  const userName = localStorage.getItem("user_name");


  const [appointmentInfo, setAppointmentInfo] = useState(null);


  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  useEffect(() => {
    socket.connect();

    socket.emit("join", { appointment_id: appointmentId });

    socket.on("connect", () => setConnected(true));

    socket.on("consultation_finished", (data) => {
      alert("Consultation has been completed.");

      if (role === "doctor") {
        navigate("/doctor");
      } else {
      navigate("/patient");
      }
    });


    socket.on("receive_message", (data) => {
      console.log("Received message:",data)
      setMessages((prev) => [...prev, data]);
    });
     fetch(`http://127.0.0.1:8000/appointment/${appointmentId}`)
    .then(res => res.json())
    .then(data => setAppointmentInfo(data));

    return () => {
      socket.off("receive_message");
      socket.off("consultation_finished");
      socket.disconnect();
    };
  }, [appointmentId]);

  const sendMessage = () => {
    console.log("Sending message from:" ,currentUserId);
    console.log("Role:",role);
    if (!input.trim()) return;

    socket.emit("send_message", {
      appointment_id: appointmentId,
      sender_id: currentUserId,
      message: input,
    });

    setInput("");
  };


  const finishConsultation = async () => {
    await fetch("http://127.0.0.1:8000/complete_consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_id: appointmentId,
        disease: diagnosis,
        prescription: prescription,
      }),
    });

    alert("Consultation Completed");
    navigate("/doctor");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow">
        <h2 className="font-bold">
          {!appointmentInfo
          ?"Loading..."
          :role === "doctor"
            ? `Chat with ${appointmentInfo.patientName}`
            : `Chat with Dr. ${appointmentInfo.doctorName}`}
        </h2>

        {role === "doctor" && appointmentInfo?.status==="Active" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600"
          >
            Finish Consultation
          </button>
        )}
      </div>

      {/* Messages */}
      {/* <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          // const isOwn = msg.sender_id == userId;
          const isOwn = Number(msg.sender_id) === Number(userId);

          return (
            <div
              key={index}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs shadow 
                  ${
                    isOwn
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-white text-slate-800 rounded-bl-none"
                  }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-[10px] mt-1 opacity-70 text-right">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
      </div> */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
  {messages.map((msg, index) => {
    const isOwn = Number(msg.sender_id) === currentUserId;

    return (
      <div
        key={`${msg.timestamp || index}-${index}`}
        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`px-4 py-2 rounded-2xl max-w-sm shadow text-sm
            ${
              isOwn
                ? "bg-indigo-600 text-white rounded-br-none"
                : "bg-white text-slate-800 rounded-bl-none border"
            }`}
        >
          <p>{msg.message}</p>
          <p className="text-[10px] mt-1 opacity-60 text-right">
            {msg.timestamp? new Date(msg.timestamp).toLocaleTimeString()
            : ""}
          </p>
        </div>
      </div>
    );
  })}
</div>


      {/* Input */}
      <div className="p-3 bg-white flex gap-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          placeholder="Type your message..."
          disabled={!connected}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 rounded-full hover:bg-indigo-700"
        >
          Send
        </button>
      </div>

      {/* Diagnosis Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Enter Diagnosis</h3>

            <input
              type="text"
              placeholder="Disease"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              placeholder="Prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={finishConsultation}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
