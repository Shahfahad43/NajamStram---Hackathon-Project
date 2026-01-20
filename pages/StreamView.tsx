import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { ChatMessage } from '../types';
import { Send, Heart, Share2, AlertCircle, Sparkles, BrainCircuit, Users } from 'lucide-react';
import { generateTacticalInsight } from '../services/geminiService';

const StreamView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { streams, user, isLoading } = useApp();
  const stream = streams.find(s => s.id === id);
  
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: 'Welcome to the chat! Be respectful.', timestamp: 'Now', isSystem: true }
  ]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-black">
        <div className="text-center">
           <div className="w-16 h-16 border-4 border-saudi-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-white">Connecting to NajamStream...</p>
        </div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold dark:text-white">Stream not found</h2>
        <Button onClick={() => navigate('/streams')} className="mt-4">Back to Streams</Button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: user?.name || 'Guest',
      text: chatInput,
      timestamp: 'Just now'
    };
    
    setMessages([...messages, newMessage]);
    setChatInput('');
  };

  const handleGetInsight = async () => {
    setLoadingInsight(true);
    setAiInsight(null);
    const insight = await generateTacticalInsight(stream.title, stream.tags);
    setAiInsight(insight);
    setLoadingInsight(false);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden bg-black">
      {/* Video Area */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <div className="w-full bg-black aspect-video relative group">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/EvsLqQS_80E" 
            title="Live Stream" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
          
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Live</span>
            <span className="bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded text-xs flex items-center">
              <Users className="w-3 h-3 mr-1" /> {stream.viewers.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
             <div>
               <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">{stream.title}</h1>
               <div className="flex items-center gap-3">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stream.streamerName}`} alt="avatar" className="w-10 h-10 rounded-full bg-gray-200" />
                 <div>
                   <p className="font-semibold text-gray-900 dark:text-white">{stream.streamerName}</p>
                   <p className="text-xs text-saudi-green">Official Partner</p>
                 </div>
               </div>
             </div>
             <div className="flex gap-2">
               <Button variant="secondary" size="sm" className="gap-2">
                 <Heart className="w-4 h-4" /> Follow
               </Button>
               <Button variant="ghost" size="sm" className="gap-2">
                 <Share2 className="w-4 h-4" /> Share
               </Button>
               <Button variant="ghost" size="sm">
                 <AlertCircle className="w-4 h-4" />
               </Button>
             </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                 <BrainCircuit className="w-5 h-5 text-gold" /> AI Tactical Insight
               </h3>
               {!aiInsight && !loadingInsight && (
                  <Button size="sm" variant="outline" onClick={handleGetInsight} className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" /> Analyze Match
                  </Button>
               )}
             </div>
             
             {loadingInsight && (
               <div className="text-sm text-gray-500 animate-pulse">Processing live match data...</div>
             )}
             
             {aiInsight && (
               <div className="bg-gold/10 p-3 rounded-lg border border-gold/20">
                 <p className="text-sm text-gray-800 dark:text-gray-200 italic">"{aiInsight}"</p>
                 <div className="mt-2 text-right">
                    <button onClick={handleGetInsight} className="text-xs text-gold-dark hover:underline">Refresh Analysis</button>
                 </div>
               </div>
             )}
             
             {!aiInsight && !loadingInsight && (
               <p className="text-sm text-gray-500">Click to generate real-time analysis based on the stream.</p>
             )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full lg:w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-[400px] lg:h-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 font-semibold text-gray-900 dark:text-white">
          Live Chat
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`text-sm ${msg.isSystem ? 'text-gray-400 italic text-center text-xs my-2' : ''}`}>
               {!msg.isSystem && (
                 <p>
                   <span className={`font-bold mr-2 ${msg.user === user?.name ? 'text-saudi-green' : 'text-gray-700 dark:text-gray-300'}`}>
                     {msg.user}:
                   </span>
                   <span className="text-gray-600 dark:text-gray-400">{msg.text}</span>
                 </p>
               )}
               {msg.isSystem && <span>{msg.text}</span>}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
           {user ? (
             <form onSubmit={handleSendMessage} className="relative">
               <input
                 type="text"
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 placeholder="Say something..."
                 className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-saudi-green dark:text-white text-sm"
               />
               <button 
                 type="submit"
                 disabled={!chatInput.trim()}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-saudi-green hover:text-saudi-dark disabled:opacity-50"
               >
                 <Send className="w-4 h-4" />
               </button>
             </form>
           ) : (
             <div className="text-center">
               <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/login')}>
                 Log in to chat
               </Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StreamView;