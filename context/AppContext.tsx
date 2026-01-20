import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Stream, Match } from '../types';
import { supabase } from '../lib/supabase';
import { MOCK_MATCHES } from '../constants';

interface AppContextType {
  user: User | null;
  streams: Stream[];
  matches: Match[];
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  addStream: (stream: Partial<Stream>) => Promise<string | null>;
  castVote: (match: Match, team: 'home' | 'away') => Promise<void>;
  syncMatchVotes: (matches: Match[]) => Promise<Match[]>;
  isCreator: boolean;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to map DB format to App format
  const mapStreamFromDB = (s: any): Stream => ({
    id: s.id,
    title: s.title,
    streamerName: s.streamer_name,
    viewers: s.viewers,
    thumbnailUrl: s.thumbnail_url,
    tags: s.tags || [],
    isLive: s.is_live,
    description: s.description
  });

  // Map DB match to App match
  const mapMatchFromDB = (m: any): Match => ({
    id: m.id,
    homeTeam: m.home_team,
    awayTeam: m.away_team,
    date: m.date,
    time: m.time,
    venue: m.venue,
    group: m.group_name,
    status: m.status,
    homeScore: m.home_score,
    awayScore: m.away_score,
    homeVotes: m.home_votes || Math.floor(Math.random() * 1000) + 100, // Fallback/Random if DB empty
    awayVotes: m.away_votes || Math.floor(Math.random() * 1000) + 100
  });

  // Fetch initial data & Setup Realtime
  useEffect(() => {
    const initData = async () => {
      // 1. Check Session
      const { data: { session } } = await supabase.auth.getSession();
      let currentUser = null;
      if (session?.user) {
        currentUser = mapSupabaseUser(session.user);
      } else {
        setIsLoading(false);
      }

      // 2. Auth Listener
      const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          mapSupabaseUser(session.user);
          // Re-fetch matches to sync user votes (if we were persisting them)
          fetchMatches(session.user.id);
        } else {
          setUser(null);
          setIsLoading(false);
          // Re-fetch matches to clear user votes
          fetchMatches(undefined);
        }
      });

      // 3. Initial Fetch
      await fetchStreams();
      await fetchMatches(currentUser?.id || session?.user?.id);

      // 4. Realtime Listener for Streams
      const channel = supabase.channel('public:data')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'streams' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setStreams(prev => [mapStreamFromDB(payload.new), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setStreams(prev => prev.map(s => s.id === payload.new.id ? mapStreamFromDB(payload.new) : s));
          } else if (payload.eventType === 'DELETE') {
            setStreams(prev => prev.filter(s => s.id !== payload.old.id));
          }
        })
        .subscribe();

      return () => {
        authSub.unsubscribe();
        supabase.removeChannel(channel);
      };
    };

    initData();
  }, []);

  const mapSupabaseUser = (u: any) => {
    const appUser: User = {
      id: u.id,
      email: u.email || '',
      name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
      role: u.user_metadata?.role || 'creator',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`
    };
    setUser(appUser);
    setIsLoading(false);
    return appUser;
  };

  const fetchStreams = async () => {
    const { data, error } = await supabase
      .from('streams')
      .select('*')
      .order('is_live', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStreams(data.map(mapStreamFromDB));
    }
  };

  const fetchMatches = async (userId?: string) => {
    // Fetch matches from DB for structure, but ignore votes table
    const { data: matchesData, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: true });

    let mappedMatches: Match[] = [];

    if (!error && matchesData && matchesData.length > 0) {
      mappedMatches = matchesData.map(mapMatchFromDB);
    } else {
      mappedMatches = [...MOCK_MATCHES];
    }
    
    // Static mode: No persistent user votes fetching from Supabase
    setMatches(mappedMatches);
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signup = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: 'creator' } },
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMatches(prev => prev.map(m => ({ ...m, userVoted: undefined })));
  };

  const addStream = async (stream: Partial<Stream>): Promise<string | null> => {
    const { data, error } = await supabase.from('streams').insert({
      title: stream.title,
      streamer_name: stream.streamerName,
      viewers: stream.viewers,
      thumbnail_url: stream.thumbnailUrl,
      tags: stream.tags,
      is_live: stream.isLive,
      user_id: user?.id
    }).select().single();

    if (error) {
      console.error("Error adding stream:", error.message || error);
      return null;
    }
    return data ? data.id : null;
  };

  const castVote = async (match: Match, team: 'home' | 'away') => {
    // STATIC MOCK IMPLEMENTATION
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    // Generate biased random votes to make it look active
    // Base votes
    const baseTotal = Math.floor(Math.random() * 5000) + 1000;
    
    // Random split, slightly favored towards one side just for variety
    const ratio = 0.4 + (Math.random() * 0.2); // 0.4 to 0.6
    
    let homeCount = Math.floor(baseTotal * ratio);
    let awayCount = baseTotal - homeCount;
    
    // Add the user's vote
    if (team === 'home') homeCount++;
    else awayCount++;

    setMatches(prev => prev.map(m => {
      if (m.id === match.id) {
        return {
          ...m,
          homeVotes: homeCount,
          awayVotes: awayCount,
          userVoted: team
        };
      }
      return m;
    }));
  };

  // Sync external API matches - pass through with existing random data or default
  const syncMatchVotes = async (externalMatches: Match[]): Promise<Match[]> => {
    // In static mode, we just return the external matches which already have random votes from the service
    return externalMatches;
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      streams, 
      matches, 
      login, 
      signup,
      logout, 
      addStream, 
      castVote,
      syncMatchVotes,
      isCreator: user?.role === 'creator',
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};