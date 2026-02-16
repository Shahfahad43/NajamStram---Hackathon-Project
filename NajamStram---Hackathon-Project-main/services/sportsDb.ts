import { Match } from '../types';

// Using the public test key '3' which supports CORS and standard endpoints
const API_KEY = '3';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

// Helper to generate random initial votes
const getRandomVotes = () => Math.floor(Math.random() * 500) + 50;

// Fallback data in case API fails
const getFallbackMatches = (): Match[] => {
  const today = new Date();
  const matches: Match[] = [];
  // Premier League Teams
  const teams = [
    'Manchester City', 'Arsenal', 'Liverpool', 'Aston Villa', 
    'Tottenham', 'Chelsea', 'Newcastle', 'Manchester United', 
    'West Ham', 'Brighton', 'Wolves', 'Fulham'
  ];
  const venues = [
    'Etihad Stadium', 'Emirates Stadium', 'Anfield', 
    'Villa Park', 'Tottenham Hotspur Stadium', 'Stamford Bridge'
  ];

  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate 2 matches per day
    for (let j = 0; j < 2; j++) {
      const homeIdx = (i * 2 + j) % teams.length;
      const awayIdx = (teams.length - 1 - (i * 2 + j)) % teams.length;
      
      matches.push({
        id: `fallback-epl-${i}-${j}`,
        homeTeam: teams[homeIdx],
        awayTeam: teams[awayIdx],
        date: dateStr,
        time: j === 0 ? '20:00' : '22:00',
        venue: venues[(i + j) % venues.length],
        group: 'Premier League',
        status: 'Upcoming',
        homeScore: 0,
        awayScore: 0,
        homeVotes: getRandomVotes(),
        awayVotes: getRandomVotes()
      });
    }
  }
  return matches;
};

export const getLeagueFixtures = async (): Promise<Match[]> => {
  try {
    // 4328 = English Premier League
    const leagueId = '4328';
    
    const url = `${BASE_URL}/eventsnextleague.php?id=${leagueId}`;
    let allEvents: any[] = [];
    
    try {
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.events)) {
                // Filter for Premier League data
                const validEvents = data.events.filter((e: any) => {
                    const leagueName = e.strLeague?.toLowerCase() || '';
                    const id = e.idLeague;
                    // Check for EPL ID or name
                    return id === leagueId || leagueName.includes('premier league') || leagueName.includes('english');
                });
                allEvents = validEvents;
            }
        }
    } catch (error) {
        console.warn(`Network error fetching league ${leagueId}. Using fallback data.`);
    }

    // If no valid data found, use fallback
    if (allEvents.length === 0) {
      console.info("Using fallback Premier League match data.");
      return getFallbackMatches();
    }

    // Calculate date range (Today + 14 days)
    const today = new Date();
    const limitDate = new Date(today);
    limitDate.setDate(today.getDate() + 14);

    const todayStr = today.toISOString().split('T')[0];
    const limitStr = limitDate.toISOString().split('T')[0];

    // Filter events by date
    const upcomingEvents = allEvents.filter(event => {
      if (!event.dateEvent) return false;
      return event.dateEvent >= todayStr && event.dateEvent <= limitStr;
    });

    // Sort by date and time
    upcomingEvents.sort((a, b) => {
      const timeA = a.strTime || '00:00:00';
      const timeB = b.strTime || '00:00:00';
      const dateTimeA = new Date(`${a.dateEvent}T${timeA}`).getTime();
      const dateTimeB = new Date(`${b.dateEvent}T${timeB}`).getTime();
      return dateTimeA - dateTimeB;
    });

    // Map to Match interface
    const mappedEvents = upcomingEvents.map(event => ({
      id: event.idEvent,
      homeTeam: event.strHomeTeam,
      awayTeam: event.strAwayTeam,
      date: event.dateEvent,
      time: event.strTime?.slice(0, 5) || 'TBD',
      venue: event.strVenue || 'Stadium',
      group: event.strLeague,
      status: 'Upcoming' as const,
      homeScore: 0,
      awayScore: 0,
      homeVotes: getRandomVotes(),
      awayVotes: getRandomVotes()
    }));

    return mappedEvents.length > 0 ? mappedEvents : getFallbackMatches();

  } catch (err) {
    console.error("Critical error in getLeagueFixtures, returning fallback:", err);
    return getFallbackMatches();
  }
};