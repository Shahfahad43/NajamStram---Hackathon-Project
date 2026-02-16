import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import {
  MapPin,
  Calendar,
  Clock,
  Trophy,
  Globe,
  Bell,
  PlayCircle,
  Vote,
  CheckCircle2,
  Star,
  Target,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Match } from "../types";

// ─────────────────────────────────────────────────────────────────
// 🏴󠁧󠁢󠁥󠁮󠁧󠁿 LIVE PREMIER LEAGUE DATA — Feb 2026
// ─────────────────────────────────────────────────────────────────

interface GoalScorer {
  player: string;
  minute: number;
  team: "home" | "away";
  isPenalty?: boolean;
  isOwnGoal?: boolean;
}

interface MatchReview {
  summary: string;
  manOfTheMatch: {
    name: string;
    team: string;
    imageUrl: string;
    rating: number;
    stats: string;
  };
  goalScorers: GoalScorer[];
}

interface TeamForm {
  recentResults: Array<{
    result: "W" | "L" | "D";
    opponent: string;
    score: string;
    date: string;
  }>;
  upcomingMatches: Array<{ opponent: string; date: string; venue: "H" | "A" }>;
}

interface EPLGame {
  id: string;
  status: "final" | "scheduled" | "live";
  start_time: string;
  homeName: string;
  awayName: string;
  homeScore?: number;
  awayScore?: number;
  homeWinProb?: number;
  awayWinProb?: number;
  drawProb?: number;
  review?: MatchReview;
}

// Sample match reviews for completed games
const MATCH_REVIEWS: Record<string, MatchReview> = {
  "epl-1": {
    summary:
      "An entertaining draw at Stamford Bridge saw both sides share the spoils. Leeds showed resilience to come from behind twice, with Chelsea's attacking prowess matched by their defensive frailties.",
    manOfTheMatch: {
      name: "Cole Palmer",
      team: "Chelsea FC",
      imageUrl:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop",
      rating: 8.5,
      stats: "2 goals, 3 key passes, 89% pass accuracy",
    },
    goalScorers: [
      { player: "Cole Palmer", minute: 23, team: "home" },
      { player: "Crysencio Summerville", minute: 38, team: "away" },
      { player: "Nicolas Jackson", minute: 67, team: "home" },
      { player: "Georginio Rutter", minute: 82, team: "away" },
    ],
  },
  "epl-2": {
    summary:
      "Bournemouth secured a crucial away victory at Goodison Park with a disciplined performance. The Cherries capitalized on Everton's defensive lapses to claim all three points.",
    manOfTheMatch: {
      name: "Dominic Solanke",
      team: "AFC Bournemouth",
      imageUrl:
        "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=400&fit=crop",
      rating: 8.7,
      stats: "1 goal, 1 assist, 4 shots on target",
    },
    goalScorers: [
      { player: "Dominic Solanke", minute: 15, team: "away" },
      {
        player: "Dominic Calvert-Lewin",
        minute: 44,
        team: "home",
        isPenalty: true,
      },
      { player: "Antoine Semenyo", minute: 78, team: "away" },
    ],
  },
  "epl-3": {
    summary:
      "Newcastle stunned Tottenham with a commanding performance in North London. The Magpies' pressing game disrupted Spurs' rhythm, with two clinical goals securing the win.",
    manOfTheMatch: {
      name: "Alexander Isak",
      team: "Newcastle United",
      imageUrl:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop",
      rating: 9.0,
      stats: "2 goals, 5 shots, 2 dribbles completed",
    },
    goalScorers: [
      { player: "Son Heung-min", minute: 12, team: "home" },
      { player: "Alexander Isak", minute: 34, team: "away" },
      { player: "Alexander Isak", minute: 71, team: "away" },
    ],
  },
  "epl-4": {
    summary:
      "A tactical stalemate at the London Stadium ended with honors even. Both teams had chances but solid defending and poor finishing kept the scoreline level.",
    manOfTheMatch: {
      name: "Bruno Fernandes",
      team: "Manchester United",
      imageUrl:
        "https://images.unsplash.com/photo-1625995890160-b5b0c6821e3e?w=400&h=400&fit=crop",
      rating: 7.8,
      stats: "1 goal, 7 passes created, 2 tackles",
    },
    goalScorers: [
      { player: "Jarrod Bowen", minute: 28, team: "home" },
      { player: "Bruno Fernandes", minute: 56, team: "away" },
    ],
  },
  "epl-5": {
    summary:
      "A forgettable goalless draw at the City Ground. Both teams struggled to create clear-cut chances in a game that lacked quality in the final third.",
    manOfTheMatch: {
      name: "Morgan Gibbs-White",
      team: "Nottingham Forest",
      imageUrl:
        "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&h=400&fit=crop",
      rating: 7.2,
      stats: "5 key passes, 3 tackles, 85% pass accuracy",
    },
    goalScorers: [],
  },
  "epl-6": {
    summary:
      "Aston Villa edged past Brighton with a narrow victory at Villa Park. A solitary goal proved enough as Villa's defense held firm against Brighton's pressure.",
    manOfTheMatch: {
      name: "Ollie Watkins",
      team: "Aston Villa",
      imageUrl:
        "https://images.unsplash.com/photo-1616832880799-6e1bd67c6e06?w=400&h=400&fit=crop",
      rating: 8.3,
      stats: "1 goal, 3 shots on target, 2 dribbles",
    },
    goalScorers: [{ player: "Ollie Watkins", minute: 41, team: "home" }],
  },
  "epl-7": {
    summary:
      "A thrilling encounter at Selhurst Park saw Burnley snatch victory with a late goal. Crystal Palace will rue missed chances in an end-to-end contest.",
    manOfTheMatch: {
      name: "Lyle Foster",
      team: "Burnley FC",
      imageUrl:
        "https://images.unsplash.com/photo-1594717527796-e43839923773?w=400&h=400&fit=crop",
      rating: 8.8,
      stats: "2 goals, 1 assist, 6 shots",
    },
    goalScorers: [
      { player: "Jean-Philippe Mateta", minute: 18, team: "home" },
      { player: "Lyle Foster", minute: 25, team: "away" },
      { player: "Eberechi Eze", minute: 52, team: "home" },
      { player: "Lyle Foster", minute: 69, team: "away" },
      { player: "Josh Brownhill", minute: 88, team: "away" },
    ],
  },
  "epl-8": {
    summary:
      "Manchester City cruised to a comfortable victory over Fulham at the Etihad. Dominant from start to finish, City's attacking trio tore apart the Cottagers' defense.",
    manOfTheMatch: {
      name: "Erling Haaland",
      team: "Manchester City",
      imageUrl:
        "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400&h=400&fit=crop",
      rating: 9.2,
      stats: "Hat-trick, 8 shots, 100% dribble success",
    },
    goalScorers: [
      { player: "Erling Haaland", minute: 12, team: "home" },
      { player: "Erling Haaland", minute: 34, team: "home" },
      { player: "Erling Haaland", minute: 76, team: "home" },
    ],
  },
  "epl-9": {
    summary:
      "Liverpool secured a hard-fought away win at the Stadium of Light. A single goal proved decisive as the Reds weathered Sunderland's pressure to claim three vital points.",
    manOfTheMatch: {
      name: "Mohamed Salah",
      team: "Liverpool FC",
      imageUrl:
        "https://images.unsplash.com/photo-1628582430486-061a7e224580?w=400&h=400&fit=crop",
      rating: 8.4,
      stats: "1 goal, 4 shots, 3 key passes",
    },
    goalScorers: [{ player: "Mohamed Salah", minute: 63, team: "away" }],
  },
  "epl-10": {
    summary:
      "Arsenal were held to a frustrating draw at Brentford. The Gunners dominated possession but couldn't find a winner against a well-organized Bees side.",
    manOfTheMatch: {
      name: "David Raya",
      team: "Brentford FC",
      imageUrl:
        "https://images.unsplash.com/photo-1611415468390-6a8e0b4e3ae9?w=400&h=400&fit=crop",
      rating: 8.6,
      stats: "7 saves, 2 high claims, 85% save rate",
    },
    goalScorers: [
      { player: "Bryan Mbeumo", minute: 31, team: "home" },
      { player: "Bukayo Saka", minute: 58, team: "away" },
    ],
  },
};

// Team form data for big teams
const TEAM_FORMS: Record<string, TeamForm> = {
  "Manchester City": {
    recentResults: [
      { result: "W", opponent: "Fulham FC", score: "3-0", date: "Feb 11" },
      { result: "W", opponent: "Chelsea FC", score: "2-0", date: "Feb 5" },
      { result: "D", opponent: "Liverpool FC", score: "1-1", date: "Feb 1" },
      { result: "W", opponent: "Brighton", score: "4-1", date: "Jan 28" },
      { result: "W", opponent: "Arsenal FC", score: "2-1", date: "Jan 22" },
    ],
    upcomingMatches: [
      { opponent: "Newcastle United", date: "Feb 21", venue: "H" },
      { opponent: "Tottenham Hotspur", date: "Feb 26", venue: "A" },
      { opponent: "Liverpool FC", date: "Mar 2", venue: "H" },
    ],
  },
  "Liverpool FC": {
    recentResults: [
      { result: "W", opponent: "Sunderland AFC", score: "1-0", date: "Feb 11" },
      { result: "W", opponent: "Brighton", score: "3-1", date: "Feb 7" },
      { result: "D", opponent: "Manchester City", score: "1-1", date: "Feb 1" },
      { result: "W", opponent: "Chelsea FC", score: "2-0", date: "Jan 27" },
      { result: "W", opponent: "Arsenal FC", score: "3-2", date: "Jan 21" },
    ],
    upcomingMatches: [
      { opponent: "Nottingham Forest", date: "Feb 22", venue: "A" },
      { opponent: "Manchester United", date: "Feb 27", venue: "H" },
      { opponent: "Manchester City", date: "Mar 2", venue: "A" },
    ],
  },
  "Arsenal FC": {
    recentResults: [
      { result: "D", opponent: "Brentford FC", score: "1-1", date: "Feb 12" },
      { result: "W", opponent: "Wolverhampton", score: "3-0", date: "Feb 8" },
      {
        result: "W",
        opponent: "Newcastle United",
        score: "2-1",
        date: "Feb 3",
      },
      { result: "L", opponent: "Liverpool FC", score: "2-3", date: "Jan 21" },
      {
        result: "L",
        opponent: "Manchester City",
        score: "1-2",
        date: "Jan 22",
      },
    ],
    upcomingMatches: [
      { opponent: "Wolverhampton", date: "Feb 18", venue: "A" },
      { opponent: "Tottenham Hotspur", date: "Feb 22", venue: "A" },
      { opponent: "Chelsea FC", date: "Feb 28", venue: "H" },
    ],
  },
  "Chelsea FC": {
    recentResults: [
      { result: "D", opponent: "Leeds United", score: "2-2", date: "Feb 10" },
      { result: "L", opponent: "Manchester City", score: "0-2", date: "Feb 5" },
      { result: "W", opponent: "Aston Villa", score: "3-1", date: "Feb 1" },
      { result: "L", opponent: "Liverpool FC", score: "0-2", date: "Jan 27" },
      { result: "W", opponent: "Fulham FC", score: "2-0", date: "Jan 23" },
    ],
    upcomingMatches: [
      { opponent: "Burnley FC", date: "Feb 21", venue: "H" },
      { opponent: "Manchester United", date: "Feb 26", venue: "A" },
      { opponent: "Arsenal FC", date: "Feb 28", venue: "A" },
    ],
  },
  "Manchester United": {
    recentResults: [
      {
        result: "D",
        opponent: "West Ham United",
        score: "1-1",
        date: "Feb 10",
      },
      { result: "W", opponent: "Everton FC", score: "3-2", date: "Feb 6" },
      { result: "L", opponent: "Arsenal FC", score: "1-2", date: "Jan 31" },
      {
        result: "D",
        opponent: "Tottenham Hotspur",
        score: "2-2",
        date: "Jan 26",
      },
      { result: "W", opponent: "Brighton", score: "3-1", date: "Jan 21" },
    ],
    upcomingMatches: [
      { opponent: "Aston Villa", date: "Feb 20", venue: "H" },
      { opponent: "Chelsea FC", date: "Feb 26", venue: "H" },
      { opponent: "Liverpool FC", date: "Feb 27", venue: "A" },
    ],
  },
  "Tottenham Hotspur": {
    recentResults: [
      {
        result: "L",
        opponent: "Newcastle United",
        score: "1-2",
        date: "Feb 10",
      },
      { result: "W", opponent: "Fulham FC", score: "2-1", date: "Feb 5" },
      {
        result: "D",
        opponent: "Manchester United",
        score: "2-2",
        date: "Jan 26",
      },
      {
        result: "L",
        opponent: "Manchester City",
        score: "0-3",
        date: "Jan 23",
      },
      { result: "W", opponent: "Crystal Palace", score: "3-1", date: "Jan 19" },
    ],
    upcomingMatches: [
      { opponent: "Arsenal FC", date: "Feb 22", venue: "H" },
      { opponent: "Manchester City", date: "Feb 26", venue: "H" },
      { opponent: "Brighton", date: "Mar 1", venue: "A" },
    ],
  },
  "Newcastle United": {
    recentResults: [
      {
        result: "W",
        opponent: "Tottenham Hotspur",
        score: "2-1",
        date: "Feb 10",
      },
      { result: "W", opponent: "Wolverhampton", score: "3-0", date: "Feb 6" },
      { result: "L", opponent: "Arsenal FC", score: "1-2", date: "Feb 3" },
      { result: "D", opponent: "Liverpool FC", score: "1-1", date: "Jan 28" },
      { result: "W", opponent: "Chelsea FC", score: "2-1", date: "Jan 24" },
    ],
    upcomingMatches: [
      { opponent: "Manchester City", date: "Feb 21", venue: "A" },
      { opponent: "Fulham FC", date: "Feb 25", venue: "H" },
      { opponent: "Aston Villa", date: "Feb 29", venue: "A" },
    ],
  },
};

const EPL_GAMES: EPLGame[] = [
  // ── Completed results ─────────────────────────────────────
  {
    id: "epl-1",
    status: "final",
    start_time: "2026-02-10T19:30:00Z",
    homeName: "Chelsea FC",
    awayName: "Leeds United",
    homeScore: 2,
    awayScore: 2,
  },
  {
    id: "epl-2",
    status: "final",
    start_time: "2026-02-10T19:30:00Z",
    homeName: "Everton FC",
    awayName: "AFC Bournemouth",
    homeScore: 1,
    awayScore: 2,
  },
  {
    id: "epl-3",
    status: "final",
    start_time: "2026-02-10T19:30:00Z",
    homeName: "Tottenham Hotspur",
    awayName: "Newcastle United",
    homeScore: 1,
    awayScore: 2,
  },
  {
    id: "epl-4",
    status: "final",
    start_time: "2026-02-10T20:15:00Z",
    homeName: "West Ham United",
    awayName: "Manchester United",
    homeScore: 1,
    awayScore: 1,
  },
  {
    id: "epl-5",
    status: "final",
    start_time: "2026-02-11T19:30:00Z",
    homeName: "Nottingham Forest",
    awayName: "Wolverhampton",
    homeScore: 0,
    awayScore: 0,
  },
  {
    id: "epl-6",
    status: "final",
    start_time: "2026-02-11T19:30:00Z",
    homeName: "Aston Villa",
    awayName: "Brighton",
    homeScore: 1,
    awayScore: 0,
  },
  {
    id: "epl-7",
    status: "final",
    start_time: "2026-02-11T19:30:00Z",
    homeName: "Crystal Palace",
    awayName: "Burnley FC",
    homeScore: 2,
    awayScore: 3,
  },
  {
    id: "epl-8",
    status: "final",
    start_time: "2026-02-11T19:30:00Z",
    homeName: "Manchester City",
    awayName: "Fulham FC",
    homeScore: 3,
    awayScore: 0,
  },
  {
    id: "epl-9",
    status: "final",
    start_time: "2026-02-11T20:15:00Z",
    homeName: "Sunderland AFC",
    awayName: "Liverpool FC",
    homeScore: 0,
    awayScore: 1,
  },
  {
    id: "epl-10",
    status: "final",
    start_time: "2026-02-12T20:00:00Z",
    homeName: "Brentford FC",
    awayName: "Arsenal FC",
    homeScore: 1,
    awayScore: 1,
  },
  // ── Upcoming fixtures ─────────────────────────────────────
  {
    id: "epl-11",
    status: "scheduled",
    start_time: "2026-02-18T20:00:00Z",
    homeName: "Wolverhampton",
    awayName: "Arsenal FC",
    homeWinProb: 8.6,
    awayWinProb: 75.4,
    drawProb: 16,
  },
  {
    id: "epl-12",
    status: "scheduled",
    start_time: "2026-02-21T15:00:00Z",
    homeName: "Aston Villa",
    awayName: "Leeds United",
    homeWinProb: 54,
    awayWinProb: 21,
    drawProb: 25,
  },
  {
    id: "epl-13",
    status: "scheduled",
    start_time: "2026-02-21T15:00:00Z",
    homeName: "Brentford FC",
    awayName: "Brighton",
    homeWinProb: 47.5,
    awayWinProb: 26.6,
    drawProb: 25.9,
  },
  {
    id: "epl-14",
    status: "scheduled",
    start_time: "2026-02-21T15:00:00Z",
    homeName: "Chelsea FC",
    awayName: "Burnley FC",
    homeWinProb: 78.9,
    awayWinProb: 7.8,
    drawProb: 13.3,
  },
  {
    id: "epl-15",
    status: "scheduled",
    start_time: "2026-02-21T17:30:00Z",
    homeName: "West Ham United",
    awayName: "AFC Bournemouth",
    homeWinProb: 37.2,
    awayWinProb: 37.3,
    drawProb: 25.5,
  },
  {
    id: "epl-16",
    status: "scheduled",
    start_time: "2026-02-21T20:00:00Z",
    homeName: "Manchester City",
    awayName: "Newcastle United",
    homeWinProb: 65.7,
    awayWinProb: 15.6,
    drawProb: 18.7,
  },
  {
    id: "epl-17",
    status: "scheduled",
    start_time: "2026-02-22T14:00:00Z",
    homeName: "Crystal Palace",
    awayName: "Wolverhampton",
    homeWinProb: 59.6,
    awayWinProb: 17,
    drawProb: 23.4,
  },
  {
    id: "epl-18",
    status: "scheduled",
    start_time: "2026-02-22T14:00:00Z",
    homeName: "Nottingham Forest",
    awayName: "Liverpool FC",
    homeWinProb: 22.8,
    awayWinProb: 53,
    drawProb: 24.2,
  },
  {
    id: "epl-19",
    status: "scheduled",
    start_time: "2026-02-22T14:00:00Z",
    homeName: "Sunderland AFC",
    awayName: "Fulham FC",
    homeWinProb: 36.3,
    awayWinProb: 35,
    drawProb: 28.7,
  },
  {
    id: "epl-20",
    status: "scheduled",
    start_time: "2026-02-22T16:30:00Z",
    homeName: "Tottenham Hotspur",
    awayName: "Arsenal FC",
    homeWinProb: 15.4,
    awayWinProb: 62.3,
    drawProb: 22.3,
  },
];

type EPLMatch = Match & {
  _homeWinProb?: number;
  _awayWinProb?: number;
  _drawProb?: number;
  review?: MatchReview;
};

function eplToMatch(g: EPLGame): EPLMatch {
  const d = new Date(g.start_time);
  return {
    id: g.id,
    date: d.toISOString().split("T")[0],
    time:
      d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        hour12: false,
      }) + " UTC",
    homeTeam: g.homeName,
    awayTeam: g.awayName,
    homeScore: g.homeScore,
    awayScore: g.awayScore,
    status:
      g.status === "final"
        ? "Completed"
        : g.status === "live"
          ? "Live"
          : "Upcoming",
    venue: "Premier League",
    group: g.status === "final" ? "Full Time" : "Premier League",
    homeVotes: g.homeWinProb ? Math.round(g.homeWinProb * 10) : undefined,
    awayVotes: g.awayWinProb ? Math.round(g.awayWinProb * 10) : undefined,
    _homeWinProb: g.homeWinProb,
    _awayWinProb: g.awayWinProb,
    _drawProb: g.drawProb,
    review: MATCH_REVIEWS[g.id],
  } as EPLMatch;
}

const EPL_MATCHES: EPLMatch[] = EPL_GAMES.map(eplToMatch);

// ─────────────────────────────────────────────────────────────────

const Schedule: React.FC = () => {
  const {
    matches: wcMatches,
    isLoading: isWcLoading,
    castVote,
    user,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"wc" | "leagues">("wc");
  const [leagueMatches, setLeagueMatches] = useState<EPLMatch[]>([]);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [eplFilter, setEplFilter] = useState<"all" | "results" | "upcoming">(
    "all",
  );
  const [predictModeId, setPredictModeId] = useState<string | null>(null);
  const [votingMatchId, setVotingMatchId] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "leagues") {
      setLoadingLeagues(true);
      setTimeout(() => {
        setLeagueMatches(EPL_MATCHES);
        setLoadingLeagues(false);
      }, 400);
    }
  }, [activeTab, user]);

  const filteredLeague = leagueMatches.filter((m) => {
    if (eplFilter === "results")
      return m.status === "Completed" || m.status === "Live";
    if (eplFilter === "upcoming") return m.status === "Upcoming";
    return true;
  });

  const currentMatches = activeTab === "wc" ? wcMatches : filteredLeague;
  const isLoading = activeTab === "wc" ? isWcLoading : loadingLeagues;

  const handleVote = async (match: EPLMatch, team: "home" | "away") => {
    if (votingMatchId) return;
    setVotingMatchId(match.id);
    try {
      const total = Math.floor(Math.random() * 4000) + 500;
      const ratio = 0.35 + Math.random() * 0.3;
      let homeV = Math.floor(total * ratio);
      let awayV = total - homeV;
      if (team === "home") homeV += 1;
      else awayV += 1;

      if (activeTab === "leagues") {
        await new Promise((r) => setTimeout(r, 600));
        setLeagueMatches((prev) =>
          prev.map((m) =>
            m.id === match.id
              ? { ...m, homeVotes: homeV, awayVotes: awayV, userVoted: team }
              : m,
          ),
        );
      } else {
        await castVote(match, team);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVotingMatchId(null);
    }
  };

  const toggleMatchDetails = (matchId: string) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  const grouped = currentMatches.reduce(
    (g, m) => {
      (g[m.date] ??= []).push(m);
      return g;
    },
    {} as Record<string, EPLMatch[]>,
  );
  const sortedDates = Object.keys(grouped).sort();
  const pct = (v?: number, t?: number) =>
    !v || !t ? 0 : Math.floor((v / t) * 100);

  const resultsCount = leagueMatches.filter(
    (m) => m.status === "Completed" || m.status === "Live",
  ).length;
  const upcomingCount = leagueMatches.filter(
    (m) => m.status === "Upcoming",
  ).length;

  const getResultIcon = (result: "W" | "L" | "D") => {
    if (result === "W")
      return (
        <div className="w-5 h-5 rounded-full bg-saudi-green flex items-center justify-center">
          <TrendingUp className="w-3 h-3 text-white" />
        </div>
      );
    if (result === "L")
      return (
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
          <TrendingDown className="w-3 h-3 text-white" />
        </div>
      );
    return (
      <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
        <Minus className="w-3 h-3 text-white" />
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Match <span className="text-saudi-green">Schedule</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg text-lg">
            Official fixtures, venues, and live results.
          </p>
        </div>

        {/* Main tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mt-6 md:mt-0">
          <button
            onClick={() => setActiveTab("wc")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === "wc" ? "bg-white dark:bg-gray-700 text-saudi-green shadow-sm" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
          >
            <Trophy className="w-4 h-4" /> World Cup
          </button>
          <button
            onClick={() => setActiveTab("leagues")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === "leagues" ? "bg-white dark:bg-gray-700 text-saudi-green shadow-sm" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
          >
            <span className="text-base leading-none">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            Premier League
          </button>
        </div>
      </div>

      {/* ── PL Sub-filter bar ── */}
      {activeTab === "leagues" && !loadingLeagues && (
        <div className="flex flex-wrap items-center gap-3 mb-8 animate-in fade-in duration-300">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {(
              [
                {
                  key: "all",
                  label: "All Fixtures",
                  count: leagueMatches.length,
                },
                { key: "results", label: "Results", count: resultsCount },
                { key: "upcoming", label: "Upcoming", count: upcomingCount },
              ] as const
            ).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setEplFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${eplFilter === key ? "bg-white dark:bg-gray-700 text-saudi-green shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
              >
                {label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${eplFilter === key ? "bg-saudi-green text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-saudi-green inline-block"></span>
            2025/26 Season · Matchday 26–27
          </div>
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
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
              <div
                key={date}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* Date header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-2 w-2 rounded-full bg-saudi-green shrink-0"></div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide whitespace-nowrap">
                    {new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {grouped[date].length}{" "}
                    {grouped[date].length === 1 ? "match" : "matches"}
                  </span>
                </div>

                <div className="grid gap-4">
                  {(grouped[date] as EPLMatch[]).map((m) => {
                    const isCompleted = m.status === "Completed";
                    const isUpcoming = m.status === "Upcoming";
                    const isLive = m.status === "Live";
                    const totalVotes = (m.homeVotes || 0) + (m.awayVotes || 0);
                    const homeP = pct(m.homeVotes, totalVotes);
                    const awayP = pct(m.awayVotes, totalVotes);
                    const homeWon =
                      isCompleted && (m.homeScore ?? 0) > (m.awayScore ?? 0);
                    const awayWon =
                      isCompleted && (m.awayScore ?? 0) > (m.homeScore ?? 0);
                    const isDraw = isCompleted && m.homeScore === m.awayScore;
                    const isExpanded = expandedMatchId === m.id;
                    const homeForm = TEAM_FORMS[m.homeTeam];
                    const awayForm = TEAM_FORMS[m.awayTeam];

                    return (
                      <div
                        key={m.id}
                        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden"
                      >
                        {/* Status stripe */}
                        {isLive && (
                          <div className="h-1 w-full bg-red-500 animate-pulse" />
                        )}
                        {isCompleted && (
                          <div className="h-0.5 w-full bg-gradient-to-r from-saudi-green/50 to-transparent" />
                        )}
                        {isUpcoming && (
                          <div className="h-0.5 w-full bg-gradient-to-r from-blue-400/40 to-transparent" />
                        )}

                        <div className="p-5 md:px-7 flex flex-col md:flex-row items-center gap-5 md:gap-0">
                          {/* Left — time */}
                          <div className="w-full md:w-1/5 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-1">
                            <span className="font-mono text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                              {m.time}
                            </span>
                            {isLive && (
                              <span className="flex items-center gap-1 text-xs font-bold text-red-600 animate-pulse">
                                <span className="w-2 h-2 bg-red-600 rounded-full" />
                                LIVE
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Full Time
                              </span>
                            )}
                            {isUpcoming && (
                              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                                Upcoming
                              </span>
                            )}
                          </div>

                          {/* Center — teams + score */}
                          <div className="flex-1 w-full flex items-center justify-between gap-4 md:gap-6">
                            {/* Home */}
                            <div className="flex-1 text-right">
                              <span
                                className={`text-base md:text-lg font-bold block leading-tight ${homeWon ? "text-saudi-green" : isDraw ? "text-gray-700 dark:text-gray-200" : awayWon ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}
                              >
                                {m.homeTeam}
                              </span>
                              {isUpcoming && m._homeWinProb !== undefined && (
                                <span className="text-[10px] text-gray-400">
                                  {m._homeWinProb}% win
                                </span>
                              )}
                            </div>

                            {/* Score / VS */}
                            <div className="shrink-0">
                              {isUpcoming ? (
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 shadow-inner">
                                  VS
                                </div>
                              ) : (
                                <div
                                  className={`px-4 py-2 rounded-xl text-white font-mono text-xl font-bold tracking-widest shadow-md border ${isLive ? "bg-red-600 border-red-500" : "bg-gray-900 dark:bg-black border-gray-700"}`}
                                >
                                  {m.homeScore} : {m.awayScore}
                                </div>
                              )}
                            </div>

                            {/* Away */}
                            <div className="flex-1 text-left">
                              <span
                                className={`text-base md:text-lg font-bold block leading-tight ${awayWon ? "text-saudi-green" : isDraw ? "text-gray-700 dark:text-gray-200" : homeWon ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}
                              >
                                {m.awayTeam}
                              </span>
                              {isUpcoming && m._awayWinProb !== undefined && (
                                <span className="text-[10px] text-gray-400">
                                  {m._awayWinProb}% win
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right — actions */}
                          <div className="w-full md:w-1/5 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 mt-2 md:mt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700 pt-3 md:pt-0">
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              <Globe className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[110px]"></span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isLive ? (
                                <Button
                                  size="sm"
                                  className="h-9 text-xs gap-1 shadow-md shadow-saudi-green/20"
                                >
                                  <PlayCircle className="w-3 h-3" /> Watch
                                </Button>
                              ) : (
                                <>
                                  {isUpcoming && !m.userVoted && (
                                    <button
                                      onClick={() =>
                                        setPredictModeId(
                                          predictModeId === m.id ? null : m.id,
                                        )
                                      }
                                      className={`h-9 px-3 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${predictModeId === m.id ? "bg-saudi-green text-white border-saudi-green" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                    >
                                      <Vote className="w-3 h-3" /> Predict
                                    </button>
                                  )}
                                  {m.userVoted && (
                                    <div className="flex items-center gap-1 text-xs text-saudi-green font-medium bg-saudi-green/10 px-2 py-1 rounded-md">
                                      <CheckCircle2 className="w-3 h-3" /> Voted
                                    </div>
                                  )}
                                  {isCompleted && (
                                    <>
                                      <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-md ${homeWon || awayWon ? "bg-saudi-green/10 text-saudi-green" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}
                                      >
                                        {homeWon
                                          ? `${m.homeTeam.split(" ")[0]} Win`
                                          : awayWon
                                            ? `${m.awayTeam.split(" ")[0]} Win`
                                            : "Draw"}
                                      </span>
                                      {m.review && (
                                        <button
                                          onClick={() =>
                                            toggleMatchDetails(m.id)
                                          }
                                          className="p-2 text-gray-400 hover:text-saudi-green transition-colors"
                                          title="Match Details"
                                        >
                                          {isExpanded ? (
                                            <ChevronUp className="w-4 h-4" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4" />
                                          )}
                                        </button>
                                      )}
                                    </>
                                  )}
                                  {isUpcoming && (
                                    <button
                                      className="p-2 text-gray-400 hover:text-saudi-green transition-colors"
                                      title="Set Reminder"
                                    >
                                      <Bell className="w-4 h-4" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ── Match Details (for completed matches) ── */}
                        {isCompleted && isExpanded && m.review && (
                          <div className="border-t border-gray-100 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 animate-in fade-in slide-in-from-top-2">
                            <div className="p-6 space-y-6">
                              {/* Match Summary */}
                              <div className="space-y-2">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                  <div className="w-1 h-4 bg-saudi-green rounded-full"></div>
                                  Match Review
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {m.review.summary}
                                </p>
                              </div>

                              {/* Man of the Match */}
                              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-start gap-4">
                                  <div className="relative shrink-0">
                                    <img
                                      src={m.review.manOfTheMatch.imageUrl}
                                      alt={m.review.manOfTheMatch.name}
                                      className="w-20 h-20 rounded-full object-cover border-4 border-amber-400"
                                    />
                                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                                      <Star className="w-4 h-4 text-amber-900 fill-amber-900" />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                                        {m.review.manOfTheMatch.name}
                                      </h4>
                                      <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                                        {m.review.manOfTheMatch.rating}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                      {m.review.manOfTheMatch.team}
                                    </p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                                      {m.review.manOfTheMatch.stats}
                                    </p>
                                  </div>
                                  <div className="shrink-0 flex items-center gap-1">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                      MOTM
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Goal Scorers */}
                              {m.review.goalScorers.length > 0 && (
                                <div className="space-y-3">
                                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-1 h-4 bg-saudi-green rounded-full"></div>
                                    Goal Scorers
                                  </h3>
                                  <div className="grid gap-2">
                                    {m.review.goalScorers.map((goal, idx) => (
                                      <div
                                        key={idx}
                                        className={`flex items-center justify-between p-3 rounded-lg border ${goal.team === "home" ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"}`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${goal.team === "home" ? "bg-blue-500" : "bg-red-500"}`}
                                          >
                                            <Target className="w-4 h-4 text-white" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                              {goal.player}
                                              {goal.isPenalty && (
                                                <span className="ml-1 text-xs text-gray-500">
                                                  (pen)
                                                </span>
                                              )}
                                              {goal.isOwnGoal && (
                                                <span className="ml-1 text-xs text-red-600">
                                                  (OG)
                                                </span>
                                              )}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              {goal.team === "home"
                                                ? m.homeTeam
                                                : m.awayTeam}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-3 h-3 text-gray-400" />
                                          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                            {goal.minute}'
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Team Form & Upcoming Matches */}
                              <div className="grid md:grid-cols-2 gap-4">
                                {/* Home Team Form */}
                                {homeForm && (
                                  <div className="space-y-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                      {m.homeTeam} - Recent Form
                                    </h4>
                                    <div className="flex gap-1">
                                      {homeForm.recentResults.map(
                                        (result, idx) => (
                                          <div
                                            key={idx}
                                            className="group relative"
                                          >
                                            {getResultIcon(result.result)}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                                {result.result === "W"
                                                  ? "Won"
                                                  : result.result === "L"
                                                    ? "Lost"
                                                    : "Drew"}{" "}
                                                vs {result.opponent} (
                                                {result.score})
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                    <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                        Upcoming:
                                      </p>
                                      {homeForm.upcomingMatches
                                        .slice(0, 2)
                                        .map((match, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center justify-between text-xs"
                                          >
                                            <span className="text-gray-700 dark:text-gray-300">
                                              {match.venue === "H" ? "vs" : "@"}{" "}
                                              {match.opponent}
                                            </span>
                                            <span className="text-gray-500">
                                              {match.date}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}

                                {/* Away Team Form */}
                                {awayForm && (
                                  <div className="space-y-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                      {m.awayTeam} - Recent Form
                                    </h4>
                                    <div className="flex gap-1">
                                      {awayForm.recentResults.map(
                                        (result, idx) => (
                                          <div
                                            key={idx}
                                            className="group relative"
                                          >
                                            {getResultIcon(result.result)}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                                {result.result === "W"
                                                  ? "Won"
                                                  : result.result === "L"
                                                    ? "Lost"
                                                    : "Drew"}{" "}
                                                vs {result.opponent} (
                                                {result.score})
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                    <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                        Upcoming:
                                      </p>
                                      {awayForm.upcomingMatches
                                        .slice(0, 2)
                                        .map((match, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center justify-between text-xs"
                                          >
                                            <span className="text-gray-700 dark:text-gray-300">
                                              {match.venue === "H" ? "vs" : "@"}{" "}
                                              {match.opponent}
                                            </span>
                                            <span className="text-gray-500">
                                              {match.date}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── Voting / Odds drawer (for upcoming matches) ── */}
                        {(predictModeId === m.id || m.userVoted) &&
                          isUpcoming && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 p-4 animate-in fade-in slide-in-from-top-2">
                              {!m.userVoted ? (
                                <div className="flex flex-col items-center gap-3">
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Who will win?
                                  </p>

                                  {/* Win probability bar */}
                                  {m._homeWinProb !== undefined && (
                                    <div className="w-full max-w-sm">
                                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                        <span>
                                          {m.homeTeam} {m._homeWinProb}%
                                        </span>
                                        <span>Draw {m._drawProb}%</span>
                                        <span>
                                          {m.awayTeam} {m._awayWinProb}%
                                        </span>
                                      </div>
                                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                        <div
                                          className="h-full bg-saudi-green transition-all duration-700"
                                          style={{
                                            width: `${m._homeWinProb}%`,
                                          }}
                                        />
                                        <div
                                          className="h-full bg-gray-400 transition-all duration-700"
                                          style={{ width: `${m._drawProb}%` }}
                                        />
                                        <div
                                          className="h-full bg-amber-400 transition-all duration-700"
                                          style={{
                                            width: `${m._awayWinProb}%`,
                                          }}
                                        />
                                      </div>
                                      <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                                        <span className="flex items-center gap-1">
                                          <span className="w-2 h-2 rounded-full bg-saudi-green inline-block" />
                                          Home
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                                          Draw
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                                          Away
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Vote buttons */}
                                  <div className="flex gap-3 w-full max-w-sm">
                                    <button
                                      disabled={votingMatchId === m.id}
                                      onClick={() => handleVote(m, "home")}
                                      className="flex-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-saudi-green hover:bg-saudi-green/5 hover:text-saudi-green transition-all text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                    >
                                      {votingMatchId === m.id
                                        ? "Voting..."
                                        : m.homeTeam}
                                    </button>
                                    <button
                                      disabled={votingMatchId === m.id}
                                      onClick={() => handleVote(m, "away")}
                                      className="flex-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-saudi-green hover:bg-saudi-green/5 hover:text-saudi-green transition-all text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                    >
                                      {votingMatchId === m.id
                                        ? "Voting..."
                                        : m.awayTeam}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>
                                      {m.homeTeam} ({homeP}%)
                                    </span>
                                    <span>
                                      {m.awayTeam} ({awayP}%)
                                    </span>
                                  </div>
                                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                    <div
                                      className="h-full bg-saudi-green transition-all duration-1000 ease-out flex items-center justify-start pl-2"
                                      style={{ width: `${homeP}%` }}
                                    >
                                      {homeP > 10 && (
                                        <span className="text-[10px] text-white font-bold">
                                          {homeP}%
                                        </span>
                                      )}
                                    </div>
                                    <div
                                      className="h-full bg-gold transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                                      style={{ width: `${awayP}%` }}
                                    >
                                      {awayP > 10 && (
                                        <span className="text-[10px] text-white font-bold">
                                          {awayP}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-center text-xs text-gray-400">
                                    Based on {totalVotes.toLocaleString()} fan
                                    votes
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                No matches found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Try a different filter or check back later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
