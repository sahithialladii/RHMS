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



import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";

// ✅ Socket connection setup (keep this near the top of ChatRoom.jsx)
const socket = io("http://127.0.0.1:8000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});


// const socket = io("http://127.0.0.1:8000", {
//   transports: ["websocket"], // ensures stable connection
// });

const ChatRoom = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const { doctorName, connectionType, patientId } = location.state || {};

  // 🧠 Fetch role & name from localStorage
  const role = localStorage.getItem("role"); // "doctor" or "patient"
  const user = {
    name: localStorage.getItem("user_name") || "Unknown",
    user_id: localStorage.getItem("user_id"),
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
  if (!appointmentId) return;

  socket.connect();

  socket.emit("join", {
    appointment_id: appointmentId,
    user_name: user.name,
  });

  socket.on("connect", () => {
    console.log("🟢 Connected to chat server");
    setConnected(true);
  });

  socket.on("system_message", (data) => {
    setMessages((prev) => [...prev, { message: data.message, system: true }]);
  });

  socket.on("receive_message", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected from chat server");
    setConnected(false);
  });

  // ❌ DON'T disconnect the socket on unmount, only remove listeners
  return () => {
    socket.off("receive_message");
    socket.off("system_message");
    socket.off("connect");
    socket.off("disconnect");
  };
}, [appointmentId]);


  // --- SEND MESSAGE ---
  const sendMessage = () => {
    if (input.trim() === "") return;

    socket.emit("send_message", {
      appointment_id: appointmentId,
      sender_id: user.user_id,
      sender_role: role,
      message: input.trim(),
    });

    // show your own message instantly
    setMessages((prev) => [
      ...prev,
      { sender_id: user.user_id, message: input.trim(), self: true },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="p-4 bg-indigo-600 text-white text-center font-bold rounded-t-lg">
        {role === "doctor"
          ? `💬 Chat with Patient`
          : `💬 Chat with Dr. ${doctorName || "Unknown"}`}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-4 text-sm">
            No messages yet. Start the conversation 👋
          </p>
        )}


          {messages.map((msg, index) => (
  <div
    key={`${msg.sender_id || "sys"}-${msg.timestamp || Date.now()}-${index}`}
    className={`p-2 max-w-[80%] rounded-lg ${
      msg.system
        ? "text-gray-500 text-center text-sm w-full"
        : msg.sender_id === user.user_id
        ? "bg-indigo-100 self-end ml-auto text-right"
        : "bg-gray-200 self-start text-left"
    }`}
  >
    {msg.message}
  </div>
))}



      </div>

      <div className="p-3 flex border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
          placeholder={
            connected ? "Type a message..." : "Connecting to chat..."
          }
          disabled={!connected}
        />
        <button
          onClick={sendMessage}
          disabled={!connected}
          className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
