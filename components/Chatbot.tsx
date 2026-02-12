import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_history");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "Hello 👋 Welcome to NajamStream!\n\nYou can ask me about:\n• Streams\n• Schedule\n• Signup\n• Dashboard\n• Privacy\n• Terms\n\nOr just say 'Hi' 😊",
          },
        ];
  });

  // Persist chat history
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const predefinedButtons = ["Streams", "Schedule", "Signup", "Dashboard"];

  const getBotResponse = (text: string): string => {
    const lower = text.toLowerCase();

    if (["hi", "hello", "hey", "salam"].includes(lower)) {
      return "Hi there! 😊 How can I assist you today?";
    }

    if (lower.includes("stream")) {
      navigate("/streams");
      return "Taking you to Live Streams 🎥";
    }

    if (lower.includes("schedule")) {
      navigate("/schedule");
      return "Opening the Match Schedule 📅";
    }

    if (lower.includes("signup") || lower.includes("join")) {
      navigate("/signup");
      return "Redirecting you to Signup ✍️";
    }

    if (lower.includes("dashboard")) {
      navigate("/dashboard");
      return "Opening your Dashboard 📊";
    }

    if (lower.includes("privacy")) {
      navigate("/privacy");
      return "Here is our Privacy Policy 🔐";
    }

    if (lower.includes("terms")) {
      navigate("/terms");
      return "Opening Terms & Conditions 📜";
    }

    return "I didn't understand that. Try one of the buttons below 😊";
  };

  const sendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(messageText);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      setIsTyping(false);
    }, 800);
  };

  const clearChat = () => {
    localStorage.removeItem("chat_history");
    setMessages([
      {
        sender: "bot",
        text: "Chat cleared ✅\n\nYou can ask about:\n• Streams\n• Schedule\n• Signup\n• Dashboard",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-saudi-green text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-[480px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-saudi-green text-white rounded-t-xl">
            <h3 className="font-semibold">Najam Assistant</h3>
            <div className="flex gap-2">
              <button onClick={clearChat} className="text-xs underline">
                Clear
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-saudi-green text-white ml-auto"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="text-gray-500 text-xs italic">
                Assistant is typing...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Buttons */}
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            {predefinedButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => sendMessage(btn)}
                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={() => sendMessage()}
              className="bg-saudi-green text-white px-3 rounded-lg hover:scale-105 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
