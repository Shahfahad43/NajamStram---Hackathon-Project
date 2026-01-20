import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { MapPin, Calendar, Clock, Trophy, Globe, Bell, PlayCircle, Vote, CheckCircle2 } from 'lucide-react';
import { getLeagueFixtures } from '../services/sportsDb';
import { useApp } from '../context/AppContext';
import { Match } from '../types';

const Schedule: React.FC = () => {
  const { matches: wcMatches, isLoading: isWcLoading, castVote, syncMatchVotes, user } = useApp();
  
  // State for tabs and data
  const [activeTab, setActiveTab] = useState<'wc' | 'leagues'>('wc');
  const [leagueMatches, setLeagueMatches] = useState<Match[]>([]);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  
  // Voting State Tracking (for UI toggles)
  const [predictModeId, setPredictModeId] = useState<string | null>(null);
  const [votingMatchId, setVotingMatchId] = useState<string | null>(null);

  // Fetch external leagues on mount/tab change/user change
  useEffect(() => {
    if (activeTab === 'leagues') {
      const fetchLeagues = async () => {
        setLoadingLeagues(true);
        // 1. Get data from external API (already has randomized votes)
        const apiData = await getLeagueFixtures();
        // 2. Pass through context sync (no-op in static mode but good practice)
        const syncedData = await syncMatchVotes(apiData);
        setLeagueMatches(syncedData);
        setLoadingLeagues(false);
      };
      fetchLeagues();
    }
  }, [activeTab, user]);

  // Determine which dataset to use
  const currentMatches = activeTab === 'wc' ? wcMatches : leagueMatches;
  const isLoading = activeTab === 'wc' ? isWcLoading : loadingLeagues;

  // Handle voting for both WC and League matches
  const handleVote = async (match: Match, team: 'home' | 'away') => {
    if (votingMatchId) return; // Prevent double clicks
    
    setVotingMatchId(match.id);

    try {
      // Generate static random values for the "Predict" effect
      const baseTotal = Math.floor(Math.random() * 4000) + 500;
      const ratio = 0.35 + (Math.random() * 0.3); // Random split
      let newHomeVotes = Math.floor(baseTotal * ratio);
      let newAwayVotes = baseTotal - newHomeVotes;

      // Ensure the voted team gets at least +1 (logic handled in display)
      if (team === 'home') newHomeVotes += 1;
      else newAwayVotes += 1;

      if (activeTab === 'leagues') {
         // Update Local State for Leagues
         await new Promise(resolve => setTimeout(resolve, 600)); // Fake network delay
         
         setLeagueMatches(prev => prev.map(m => {
          if (m.id === match.id) {
            return {
              ...m,
              homeVotes: newHomeVotes,
              awayVotes: newAwayVotes,
              userVoted: team
            };
          }
          return m;
        }));
      } else {
        // Update Context State for WC (handled by AppContext mock)
        await castVote(match, team);
      }
    } catch (e) {
      console.error("Vote failed", e);
    } finally {
      setVotingMatchId(null);
      // We do NOT reset predictModeId so the result stays visible
    }
  };

  // Group matches by date
  const groupedMatches = currentMatches.reduce((groups, match) => {
    const date = match.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {} as Record<string, Match[]>);

  const sortedDates = Object.keys(groupedMatches).sort();

  // Percentage Calculation Logic: (votes / total) * 100, floored.
  const calculatePercentage = (votes: number | undefined, total: number) => {
    if (!votes || total === 0) return 0;
    return Math.floor((votes / total) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Match <span className="text-saudi-green">Schedule</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg text-lg">
            Official fixtures, venues, and live results.
          </p>
        </div>
        
        {/* Tabs - Pill Style */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mt-6 md:mt-0">
          <button
            onClick={() => setActiveTab('wc')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'wc' 
                ? 'bg-white dark:bg-gray-700 text-saudi-green shadow-sm' 
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            World Cup
          </button>
          <button
            onClick={() => setActiveTab('leagues')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'leagues' 
                ? 'bg-white dark:bg-gray-700 text-saudi-green shadow-sm' 
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            Premier League
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-12">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
              <div className="space-y-4">
                 <div className="h-24 bg-gray-100 dark:bg-gray-800/50 rounded-xl"></div>
                 <div className="h-24 bg-gray-100 dark:bg-gray-800/50 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {sortedDates.length > 0 ? (
            sortedDates.map((date) => (
              <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-2 w-2 rounded-full bg-saudi-green"></div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                </div>

                <div className="grid gap-4">
                  {groupedMatches[date].map((match) => {
                    const totalVotes = (match.homeVotes || 0) + (match.awayVotes || 0);
                    const homePercent = calculatePercentage(match.homeVotes, totalVotes);
                    const awayPercent = calculatePercentage(match.awayVotes, totalVotes);

                    return (
                      <div 
                        key={match.id} 
                        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden"
                      >
                         {/* Background decoration */}
                         <div className="absolute top-0 right-0 w-32 h-32 bg-saudi-green/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-saudi-green/10 transition-colors"></div>

                         <div className="p-6 md:px-8 flex flex-col md:flex-row items-center gap-6 md:gap-0">
                            
                            {/* Time & Status - Left */}
                            <div className="w-full md:w-1/4 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-1">
                               <div className="flex items-center gap-2 text-gray-900 dark:text-white font-mono text-xl md:text-2xl font-bold">
                                  {match.time}
                               </div>
                               <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                  {match.status === 'Live' ? (
                                    <span className="flex items-center text-red-600 animate-pulse">
                                      <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span> LIVE
                                    </span>
                                  ) : (
                                    match.group
                                  )}
                               </div>
                            </div>

                            {/* Match Center - Teams */}
                            <div className="flex-1 w-full flex items-center justify-between gap-4 md:gap-8">
                               {/* Home Team */}
                               <div className="flex-1 text-right">
                                  <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white block leading-tight">
                                    {match.homeTeam}
                                  </span>
                               </div>

                               {/* Score Board / VS */}
                               <div className="shrink-0 flex items-center justify-center">
                                  {match.status === 'Upcoming' ? (
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 shadow-inner">
                                      VS
                                    </div>
                                  ) : (
                                    <div className="px-4 py-2 bg-gray-900 dark:bg-black rounded-lg text-white font-mono text-xl font-bold tracking-widest shadow-lg border border-gray-700">
                                      {match.homeScore} : {match.awayScore}
                                    </div>
                                  )}
                               </div>

                               {/* Away Team */}
                               <div className="flex-1 text-left">
                                  <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white block leading-tight">
                                    {match.awayTeam}
                                  </span>
                               </div>
                            </div>

                            {/* Action Area - Right */}
                            <div className="w-full md:w-1/4 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 mt-2 md:mt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700 pt-4 md:pt-0">
                               <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-[140px]">{match.venue}</span>
                               </div>
                               
                               <div className="flex items-center gap-2">
                                 {match.status === 'Live' ? (
                                   <Button size="sm" className="w-full md:w-auto h-9 text-xs gap-1 shadow-md shadow-saudi-green/20">
                                     <PlayCircle className="w-3 h-3" /> Watch
                                   </Button>
                                 ) : (
                                   <>
                                    {!match.userVoted && (
                                      <button 
                                        onClick={() => setPredictModeId(predictModeId === match.id ? null : match.id)}
                                        className={`h-9 px-3 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                                          predictModeId === match.id 
                                            ? 'bg-saudi-green text-white border-saudi-green'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                      >
                                        <Vote className="w-3 h-3" />
                                        Predict
                                      </button>
                                    )}
                                    {match.userVoted && (
                                       <div className="flex items-center gap-1 text-xs text-saudi-green font-medium bg-saudi-green/10 px-2 py-1 rounded-md">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Voted
                                       </div>
                                    )}
                                    <button className="p-2 text-gray-400 hover:text-saudi-green transition-colors" title="Set Reminder">
                                      <Bell className="w-4 h-4" />
                                    </button>
                                   </>
                                 )}
                               </div>
                            </div>
                         </div>
                         
                         {/* Voting Area - Sliding Drawer */}
                         {(predictModeId === match.id || match.userVoted) && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 p-4 mx-0 animate-in fade-in slide-in-from-top-2">
                              {!match.userVoted ? (
                                <div className="flex flex-col items-center">
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Who will win?</p>
                                  <div className="flex gap-4 w-full max-w-sm">
                                    <button 
                                      disabled={votingMatchId === match.id}
                                      onClick={() => handleVote(match, 'home')}
                                      className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-saudi-green hover:bg-saudi-green/5 hover:text-saudi-green transition-all text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {votingMatchId === match.id ? 'Voting...' : match.homeTeam}
                                    </button>
                                    <button 
                                      disabled={votingMatchId === match.id}
                                      onClick={() => handleVote(match, 'away')}
                                      className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-saudi-green hover:bg-saudi-green/5 hover:text-saudi-green transition-all text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {votingMatchId === match.id ? 'Voting...' : match.awayTeam}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                     <span>{match.homeTeam} ({homePercent}%)</span>
                                     <span>{match.awayTeam} ({awayPercent}%)</span>
                                  </div>
                                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex relative">
                                     {/* Home Bar */}
                                     <div 
                                       className="h-full bg-saudi-green transition-all duration-1000 ease-out flex items-center justify-start pl-2"
                                       style={{ width: `${homePercent}%` }}
                                     >
                                        {homePercent > 10 && <span className="text-[10px] text-white font-bold">{homePercent}%</span>}
                                     </div>
                                     {/* Away Bar */}
                                     <div 
                                       className="h-full bg-gold transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                                       style={{ width: `${awayPercent}%` }}
                                     >
                                        {awayPercent > 10 && <span className="text-[10px] text-white font-bold">{awayPercent}%</span>}
                                     </div>
                                  </div>
                                  <p className="text-center text-xs text-gray-400">
                                    Based on {totalVotes.toLocaleString()} fan votes
                                  </p>
                                </div>
                              )}
                            </div>
                         )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                 <Calendar className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">No matches scheduled</h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Check back later for updated fixtures.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;