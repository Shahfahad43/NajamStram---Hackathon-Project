import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Video, BarChart2, Users, Settings, Wand2, ShieldAlert } from 'lucide-react';
import { generateStreamTitle } from '../services/geminiService';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { user, addStream } = useApp();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStartingStream, setIsStartingStream] = useState(false);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShieldAlert className="w-16 h-16 text-saudi-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Access Restricted</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">Please log in to access the Creator Hub.</p>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </div>
    );
  }

  const handleGenerateTitle = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const title = await generateStreamTitle(topic);
    setGeneratedTitle(title);
    setIsGenerating(false);
  };

  const handleGoLive = async () => {
    setIsStartingStream(true);
    const finalTitle = generatedTitle || topic || `Live Stream by ${user.name}`;
    
    const newStreamId = await addStream({
      title: finalTitle,
      streamerName: user.name,
      viewers: 0,
      thumbnailUrl: 'https://picsum.photos/800/450?random=' + Date.now(),
      tags: ['Live', 'New'],
      isLive: true
    });
    
    setIsStartingStream(false);

    if (newStreamId) {
      navigate(`/streams/${newStreamId}`);
    } else {
      alert("Failed to start stream. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
         <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Creator Hub</h1>
           <p className="text-gray-500">Welcome back, {user.name}</p>
         </div>
         <Button onClick={handleGoLive} isLoading={isStartingStream}>
           <Video className="w-4 h-4 mr-2" /> Start Streaming
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="flex items-center p-6 border-l-4 border-l-saudi-green">
           <div className="p-3 rounded-full bg-saudi-green/10 text-saudi-green mr-4">
             <Users className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400">Total Followers</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">0</h3>
           </div>
        </Card>
        <Card className="flex items-center p-6 border-l-4 border-l-gold">
           <div className="p-3 rounded-full bg-gold/10 text-gold-dark mr-4">
             <BarChart2 className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">0</h3>
           </div>
        </Card>
        <Card className="flex items-center p-6 border-l-4 border-l-blue-500">
           <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
             <Settings className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400">Stream Quality</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1080p</h3>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stream Setup</h2>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Stream Topic
               </label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={topic}
                   onChange={(e) => setTopic(e.target.value)}
                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-saudi-green focus:outline-none"
                   placeholder="e.g. Saudi vs Argentina Analysis"
                 />
                 <Button 
                   variant="secondary" 
                   onClick={handleGenerateTitle}
                   disabled={isGenerating || !topic}
                   isLoading={isGenerating}
                 >
                   <Wand2 className="w-4 h-4" />
                 </Button>
               </div>
               <p className="text-xs text-gray-500 mt-1">Use AI to generate a catchy title.</p>
             </div>

             <Input 
               label="Stream Title" 
               placeholder="Enter title or generate one..." 
               value={generatedTitle} 
               onChange={(e) => setGeneratedTitle(e.target.value)}
             />
             
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
               <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-saudi-green focus:outline-none">
                 <option>Live Commentary</option>
                 <option>Pre-Match Analysis</option>
                 <option>Fan Reaction</option>
                 <option>Gaming/Esports</option>
               </select>
             </div>

             <div className="pt-4">
               <Button className="w-full" onClick={handleGoLive} isLoading={isStartingStream}>Create & Go Live</Button>
             </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Streams</h2>
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500">
               <p>No streams yet. Start your first broadcast!</p>
            </div>
            <button className="w-full text-center text-sm text-saudi-green font-medium py-2 hover:underline">View All History</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;