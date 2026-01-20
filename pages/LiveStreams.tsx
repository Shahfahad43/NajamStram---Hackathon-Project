import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Filter, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Stream } from '../types';

const LiveStreams: React.FC = () => {
  const { streams } = useApp();
  const [localStreams, setLocalStreams] = useState<Stream[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Array of free stock video URLs (using .mp4 direct links for better compatibility)
  const stockVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-at-a-football-stadium-39771-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-training-with-a-ball-39887-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-audience-cheering-at-a-stadium-39765-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-people-celebrating-a-victory-in-a-stadium-39769-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-group-of-fans-cheering-on-a-stadium-39773-large.mp4',
    'https://cdn.pixabay.com/video/2023/05/23/162143-829042696_tiny.mp4',
    'https://cdn.pixabay.com/video/2022/02/28/110290-693280396_tiny.mp4'
  ];

  const getRandomVideo = () => {
    return stockVideos[Math.floor(Math.random() * stockVideos.length)];
  };

  const handleLoadMore = () => {
    // Generate 4 random streams
    const newStreams: Stream[] = Array.from({ length: 4 }).map((_, i) => {
        const idSuffix = Date.now() + i;
        const viewers = Math.floor(Math.random() * 8000) + 200;
        const isLive = Math.random() > 0.3;
        const topics = ['Tactical Analysis', 'Fan Zone', 'Match Highlights', 'Pre-game Show', 'Stadium Vlog'];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const teams = ['Saudi Arabia', 'Argentina', 'Brazil', 'France', 'Japan', 'Spain', 'Portugal'];
        const team1 = teams[Math.floor(Math.random() * teams.length)];
        const team2 = teams[Math.floor(Math.random() * teams.length)];

        return {
          id: `local-${idSuffix}`,
          title: `${topic}: ${team1} vs ${team2} - ${isLive ? 'LIVE' : 'Replay'}`,
          streamerName: `User_${Math.floor(Math.random() * 9000) + 1000}`,
          viewers: viewers,
          thumbnailUrl: getRandomVideo(), // Use video URL as thumbnailUrl to maintain type compatibility
          tags: ['World Cup', 'Football', topic.split(' ')[0]],
          isLive: isLive,
        };
    });

    setLocalStreams(prev => [...prev, ...newStreams]);
  };

  // Combine streams
  const allStreams = [...streams, ...localStreams];

  // Filtering Logic
  const categories = ['All', 'Live', 'Analysis', 'Watch Party', 'Vlog', 'Highlights', 'Gaming'];
  
  const filteredStreams = allStreams.filter(stream => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Live') return stream.isLive;
    
    // Check tags for other categories
    return stream.tags.some(tag => 
      tag.toLowerCase().includes(activeFilter.toLowerCase()) || 
      stream.title.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  // Function to check if URL is a video
  const isVideoUrl = (url: string) => {
    return url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video') || url.includes('mp4'));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Streams</h1>
          <p className="text-gray-500 dark:text-gray-400">Join the conversation with creators across the Kingdom.</p>
        </div>
        <div className="flex gap-2 items-center">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search streams..." 
               className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-saudi-green focus:outline-none dark:text-white w-full md:w-64"
             />
           </div>
           <Button 
             variant={showFilters ? "primary" : "outline"} 
             size="sm" 
             className="gap-2"
             onClick={() => setShowFilters(!showFilters)}
           >
             <Filter className="h-4 w-4" /> 
             {showFilters ? "Close" : "Filters"}
           </Button>
        </div>
      </div>

      {/* Filter Chips Area */}
      {showFilters && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
           <div className="flex items-center gap-2 mb-2">
             <Filter className="w-4 h-4 text-saudi-green" />
             <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by Category:</span>
           </div>
           <div className="flex flex-wrap gap-2">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveFilter(cat)}
                 className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                   activeFilter === cat 
                     ? 'bg-saudi-green text-white shadow-md' 
                     : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>
      )}

      {/* Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStreams.length > 0 ? (
          filteredStreams.map((stream) => (
            <Link key={stream.id} to={`/streams/${stream.id}`}>
              <Card noPadding className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {isVideoUrl(stream.thumbnailUrl) ? (
                    <video 
                      src={stream.thumbnailUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={`https://picsum.photos/800/450?random=${stream.id}`}
                    />
                  ) : (
                    <img 
                      src={stream.thumbnailUrl} 
                      alt={stream.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {stream.isLive && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide z-10">
                      LIVE
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      {stream.streamerName}
                    </span>
                    <span className="bg-saudi-green/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      {stream.viewers >= 1000 ? `${(stream.viewers/1000).toFixed(1)}k` : stream.viewers} watching
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stream.streamerName}`} alt="avatar" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight mb-1">
                          {stream.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                           Live Sports &bull; Saudi Arabia
                        </p>
                     </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                     {stream.tags.map(tag => (
                       <span key={tag} className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px]">
                         {tag}
                       </span>
                     ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
             <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
               <Search className="w-8 h-8 text-gray-400" />
             </div>
             <p className="text-lg font-semibold">No streams found for "{activeFilter}"</p>
             <p className="text-sm">Try changing your filter or check back later.</p>
             <button 
               onClick={() => setActiveFilter('All')}
               className="mt-4 text-saudi-green hover:underline font-medium"
             >
               Clear Filters
             </button>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
         <Button variant="outline" size="lg" onClick={handleLoadMore}>Load More Streams</Button>
      </div>
    </div>
  );
};

export default LiveStreams;