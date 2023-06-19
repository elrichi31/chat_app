import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
const socket = io("/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([...messages, newMessage]);
    socket.emit("message", message);
    setMessage(""); // Esto borra el mensaje del input después de enviarlo
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    socket.on("message", reciveMessage);
    return () => {
      socket.off("message", reciveMessage);
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  const reciveMessage = (data) => setMessages((state) => [...state, data]);

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="flex flex-col w-full max-w-md bg-white shadow-md rounded-xl h-screen">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chat App</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`py-2 px-4 rounded-lg ${darkMode ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-900"}`}
          >
            Toggle Mode
          </button>
        </div>
        <div className={`flex-1 overflow-auto p-4 space-y-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                message.from === "Me"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              <p className="font-bold">{message.from}</p>
              <p>{message.body}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className={`flex items-center p-4 bg-white shadow-md space-x-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <input
            type="text"
            placeholder="Message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message} // Esta línea asegura que el valor en el input es igual al estado de 'message'
            className={`flex-1 px-4 py-2 rounded-lg border-2 ${darkMode ? "bg-gray-900 border-gray-700 text-white focus:border-blue-500" : "border-gray-300 focus:border-blue-500"}`}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
