import { Match, Stream } from './types';

export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    homeTeam: 'Saudi Arabia',
    awayTeam: 'Brazil',
    date: '2034-06-09',
    time: '21:00',
    venue: 'King Salman Stadium, Riyadh',
    group: 'Group A',
    status: 'Upcoming',
    homeVotes: 1250,
    awayVotes: 980,
  },
  {
    id: '2',
    homeTeam: 'France',
    awayTeam: 'Germany',
    date: '2034-06-10',
    time: '18:00',
    venue: 'Neom Stadium, Neom',
    group: 'Group B',
    status: 'Upcoming',
    homeVotes: 850,
    awayVotes: 890,
  },
  {
    id: '3',
    homeTeam: 'Argentina',
    awayTeam: 'Japan',
    date: '2034-06-10',
    time: '21:00',
    venue: 'Jeddah Central Stadium, Jeddah',
    group: 'Group C',
    status: 'Live',
    homeScore: 1,
    awayScore: 1,
    homeVotes: 2100,
    awayVotes: 1500,
  },
  {
    id: '4',
    homeTeam: 'Spain',
    awayTeam: 'Portugal',
    date: '2034-06-11',
    time: '16:00',
    venue: 'Aramco Stadium, Al Khobar',
    group: 'Group D',
    status: 'Upcoming',
    homeVotes: 1100,
    awayVotes: 1150,
  }
];

export const MOCK_STREAMS: Stream[] = [
  {
    id: '101',
    title: 'Match Day LIVE: KSA vs Brazil Pre-game Analysis',
    streamerName: 'KSA Sports Central',
    viewers: 12500,
    thumbnailUrl: 'https://picsum.photos/800/450?random=1',
    tags: ['Analysis', 'KSA', 'Live'],
    isLive: true,
  },
  {
    id: '102',
    title: 'Tactical Breakdown: The Neom Stadium Experience',
    streamerName: 'Future Football',
    viewers: 3400,
    thumbnailUrl: 'https://picsum.photos/800/450?random=2',
    tags: ['Vlog', 'Stadium', 'Tour'],
    isLive: true,
  },
  {
    id: '103',
    title: 'Watch Party: Argentina vs Japan',
    streamerName: 'GoalGaming',
    viewers: 8900,
    thumbnailUrl: 'https://picsum.photos/800/450?random=3',
    tags: ['Watch Party', 'Reaction'],
    isLive: true,
  },
  {
    id: '104',
    title: 'Best Goals of Qualifier Rounds',
    streamerName: 'Najam Highlights',
    viewers: 1200,
    thumbnailUrl: 'https://picsum.photos/800/450?random=4',
    tags: ['Highlights', 'Replay'],
    isLive: false,
  }
];

export const VENUES = [
  'All Venues',
  'King Salman Stadium, Riyadh',
  'Neom Stadium, Neom',
  'Jeddah Central Stadium, Jeddah',
  'Aramco Stadium, Al Khobar'
];