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
            text: "Hello 👋 Welcome to NajamStream — your Mishaal AI!\n\nYou can ask me about:\n• Streams\n• Schedule\n• Signup\n• Dashboard\n• Privacy\n• Terms\n• Tourism in Saudi Arabia\n• Match Predictions\n\nOr just say 'Hi' 😊",
          },
        ];
  });

  // Persist chat history
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const predefinedButtons = [
    "Streams",
    "Schedule",
    "Signup",
    "Dashboard",
    "Tourism",
    "Prediction",
  ];

  const getBotResponse = (text: string): string => {
    const lower = text.toLowerCase();

    // Greetings
    if (["hi", "hello", "hey", "salam"].includes(lower)) {
      return "Hi there! 😊 I'm Mishaal AI. I can guide you through matches, the website, and even suggest places to explore in Saudi Arabia!";
    }

    // Website navigation
    if (lower.includes("stream") || lower.includes("watch live")) {
      navigate("/streams");
      return "The Live Stream is on the 'Watch Live' tab 🎥. You can also chat and vote in polls while watching!";
    }

    if (lower.includes("schedule") || lower.includes("fixtures")) {
      navigate("/schedule");
      return "The full Match Schedule is in the 'Match Center' 📅. Keep an eye on upcoming games!";
    }

    if (lower.includes("signup") || lower.includes("join")) {
      navigate("/signup");
      return "You can sign up here ✍️ to personalize your experience.";
    }

    if (lower.includes("dashboard")) {
      navigate("/dashboard");
      return "Opening your Dashboard 📊 to track matches, polls, and stats!";
    }

    if (lower.includes("privacy")) {
      navigate("/privacy");
      return "Here is our Privacy Policy 🔐 — your data is safe with us.";
    }

    if (lower.includes("terms")) {
      navigate("/terms");
      return "Opening Terms & Conditions 📜 — please review before using the site.";
    }

    // Tourism / Kingdom Explorer
    if (lower.includes("tourism") || lower.includes("where to go")) {
      return `🌍 Saudi Arabia is exciting during the World Cup! Here are some suggestions:\n\n• History: Explore Al-Ula or Diriyah for rich heritage.\n• Entertainment: Boulevard Riyadh City offers modern fun.\n• Nature: Visit Abha or the Red Sea for breathtaking scenery.`;
    }

    // Match Prediction / Logic Engine
    if (lower.includes("predict") || lower.includes("prediction")) {
      return `⚽ Match Prediction (Logical Estimate):\n\n• Recent Form: Team A has won 3 of their last 5 games.\n• Key Players: Their star striker is injured, lowering scoring potential.\n• Verdict: Team A has a 60% chance of winning.\n\nRemember, football is unpredictable; this is an analytical estimate, not a guarantee. Participate in live polls in the chat to share your opinion!`;
    }

    // Technical assistance
    if (lower.includes("lag") || lower.includes("video problem")) {
      return "If the video is lagging, try refreshing the page or lowering the resolution in the settings ⚙️.";
    }

    return "I didn't quite understand that. You can ask about matches, streams, tourism, or use the buttons below 😊";
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
        text: "Chat cleared ✅\n\nYou can ask about:\n• Streams\n• Schedule\n• Signup\n• Dashboard\n• Tourism\n• Match Predictions",
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
            <h3 className="font-semibold">Mishaal AI</h3>
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
