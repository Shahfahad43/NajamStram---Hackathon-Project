import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, UserPlus, Trophy } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';

const Landing: React.FC = () => {
  const { streams, isLoading } = useApp();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-saudi-green overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="md:w-2/3">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold-light font-semibold text-sm mb-6 border border-gold/30">
              The Kingdom's Premier Sports Hub
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              Witness History in <br/>
              <span className="text-gold-light">The Kingdom</span>
            </h1>
            <p className="text-xl text-green-50 mb-10 max-w-2xl leading-relaxed">
              Experience the passion of Saudi football like never before. Stream live matches, connect with local creators, and explore the beauty of the Kingdom through sports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/streams">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <Play className="w-5 h-5 fill-current" /> Start Watching
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                  <UserPlus className="w-5 h-5" /> Join the Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Live Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Trending Now
          </h2>
          <Link to="/streams" className="text-saudi-green font-medium hover:text-saudi-dark flex items-center">
            View All <span className="ml-1">&rarr;</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-64 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {streams.length > 0 ? (
              streams.slice(0, 4).map((stream) => (
                <Link key={stream.id} to={`/streams/${stream.id}`}>
                  <Card noPadding className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="relative aspect-video">
                      <img 
                        src={stream.thumbnailUrl} 
                        alt={stream.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {stream.isLive && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          LIVE
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {stream.viewers.toLocaleString()} viewers
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">{stream.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stream.streamerName}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {stream.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                        <p className="text-xs text-saudi-green/80 font-medium">Live Sports &bull; Saudi Arabia</p>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                No streams currently live. Be the first to go live!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Tournament Companion</h2>
             <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to follow the action, right from your pocket.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-12 w-12 bg-saudi-green/10 text-saudi-green rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Live Stats</h3>
                <p className="text-gray-500 dark:text-gray-400">Real-time match data, player tracking, and instant replays from every angle.</p>
             </div>
             <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-12 w-12 bg-gold/10 text-gold-dark rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Match Schedule</h3>
                <p className="text-gray-500 dark:text-gray-400">Never miss a kick-off. Filter by your favorite teams and venues like Riyadh and Neom.</p>
             </div>
             <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Creator Hub</h3>
                <p className="text-gray-500 dark:text-gray-400">Go live yourself. Share your reactions, analyze games, and build your own fanbase.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;