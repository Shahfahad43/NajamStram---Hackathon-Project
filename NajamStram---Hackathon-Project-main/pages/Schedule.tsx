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
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Match } from "../types";

// ─────────────────────────────────────────────────────────────────
// 🏴󠁧󠁢󠁥󠁮󠁧󠁿 LIVE PREMIER LEAGUE DATA — Feb 2026
// ─────────────────────────────────────────────────────────────────

interface EPLGame {
  id: string;
  status: "final" | "scheduled" | "live";
  start_time: string; // ISO UTC
  homeName: string;
  awayName: string;
  homeScore?: number;
  awayScore?: number;
  homeWinProb?: number;
  awayWinProb?: number;
  drawProb?: number;
}

const EPL_GAMES: EPLGame[] = [
  // ── Completed results ─────────────────────────────────────
  { id:"epl-1",  status:"final",     start_time:"2026-02-10T19:30:00Z", homeName:"Chelsea FC",           awayName:"Leeds United",          homeScore:2, awayScore:2 },
  { id:"epl-2",  status:"final",     start_time:"2026-02-10T19:30:00Z", homeName:"Everton FC",            awayName:"AFC Bournemouth",        homeScore:1, awayScore:2 },
  { id:"epl-3",  status:"final",     start_time:"2026-02-10T19:30:00Z", homeName:"Tottenham Hotspur",     awayName:"Newcastle United",       homeScore:1, awayScore:2 },
  { id:"epl-4",  status:"final",     start_time:"2026-02-10T20:15:00Z", homeName:"West Ham United",       awayName:"Manchester United",      homeScore:1, awayScore:1 },
  { id:"epl-5",  status:"final",     start_time:"2026-02-11T19:30:00Z", homeName:"Nottingham Forest",     awayName:"Wolverhampton",          homeScore:0, awayScore:0 },
  { id:"epl-6",  status:"final",     start_time:"2026-02-11T19:30:00Z", homeName:"Aston Villa",           awayName:"Brighton",               homeScore:1, awayScore:0 },
  { id:"epl-7",  status:"final",     start_time:"2026-02-11T19:30:00Z", homeName:"Crystal Palace",        awayName:"Burnley FC",             homeScore:2, awayScore:3 },
  { id:"epl-8",  status:"final",     start_time:"2026-02-11T19:30:00Z", homeName:"Manchester City",       awayName:"Fulham FC",              homeScore:3, awayScore:0 },
  { id:"epl-9",  status:"final",     start_time:"2026-02-11T20:15:00Z", homeName:"Sunderland AFC",        awayName:"Liverpool FC",           homeScore:0, awayScore:1 },
  { id:"epl-10", status:"final",     start_time:"2026-02-12T20:00:00Z", homeName:"Brentford FC",          awayName:"Arsenal FC",             homeScore:1, awayScore:1 },
  // ── Upcoming fixtures ─────────────────────────────────────
  { id:"epl-11", status:"scheduled", start_time:"2026-02-18T20:00:00Z", homeName:"Wolverhampton",         awayName:"Arsenal FC",             homeWinProb:8.6,  awayWinProb:75.4, drawProb:16   },
  { id:"epl-12", status:"scheduled", start_time:"2026-02-21T15:00:00Z", homeName:"Aston Villa",           awayName:"Leeds United",           homeWinProb:54,   awayWinProb:21,   drawProb:25   },
  { id:"epl-13", status:"scheduled", start_time:"2026-02-21T15:00:00Z", homeName:"Brentford FC",          awayName:"Brighton",               homeWinProb:47.5, awayWinProb:26.6, drawProb:25.9 },
  { id:"epl-14", status:"scheduled", start_time:"2026-02-21T15:00:00Z", homeName:"Chelsea FC",            awayName:"Burnley FC",             homeWinProb:78.9, awayWinProb:7.8,  drawProb:13.3 },
  { id:"epl-15", status:"scheduled", start_time:"2026-02-21T17:30:00Z", homeName:"West Ham United",       awayName:"AFC Bournemouth",        homeWinProb:37.2, awayWinProb:37.3, drawProb:25.5 },
  { id:"epl-16", status:"scheduled", start_time:"2026-02-21T20:00:00Z", homeName:"Manchester City",       awayName:"Newcastle United",       homeWinProb:65.7, awayWinProb:15.6, drawProb:18.7 },
  { id:"epl-17", status:"scheduled", start_time:"2026-02-22T14:00:00Z", homeName:"Crystal Palace",        awayName:"Wolverhampton",          homeWinProb:59.6, awayWinProb:17,   drawProb:23.4 },
  { id:"epl-18", status:"scheduled", start_time:"2026-02-22T14:00:00Z", homeName:"Nottingham Forest",     awayName:"Liverpool FC",           homeWinProb:22.8, awayWinProb:53,   drawProb:24.2 },
  { id:"epl-19", status:"scheduled", start_time:"2026-02-22T14:00:00Z", homeName:"Sunderland AFC",        awayName:"Fulham FC",              homeWinProb:36.3, awayWinProb:35,   drawProb:28.7 },
  { id:"epl-20", status:"scheduled", start_time:"2026-02-22T16:30:00Z", homeName:"Tottenham Hotspur",     awayName:"Arsenal FC",             homeWinProb:15.4, awayWinProb:62.3, drawProb:22.3 },
];

type EPLMatch = Match & { _homeWinProb?: number; _awayWinProb?: number; _drawProb?: number };

function eplToMatch(g: EPLGame): EPLMatch {
  const d = new Date(g.start_time);
  return {
    id: g.id,
    date: d.toISOString().split("T")[0],
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false }) + " UTC",
    homeTeam: g.homeName,
    awayTeam: g.awayName,
    homeScore: g.homeScore,
    awayScore: g.awayScore,
    status: g.status === "final" ? "Completed" : g.status === "live" ? "Live" : "Upcoming",
    venue: "Premier League",
    group: g.status === "final" ? "Full Time" : "Premier League",
    homeVotes: g.homeWinProb ? Math.round(g.homeWinProb * 10) : undefined,
    awayVotes: g.awayWinProb ? Math.round(g.awayWinProb * 10) : undefined,
    _homeWinProb: g.homeWinProb,
    _awayWinProb: g.awayWinProb,
    _drawProb: g.drawProb,
  } as EPLMatch;
}

const EPL_MATCHES: EPLMatch[] = EPL_GAMES.map(eplToMatch);

// ─────────────────────────────────────────────────────────────────

const Schedule: React.FC = () => {
  const { matches: wcMatches, isLoading: isWcLoading, castVote, user } = useApp();

  const [activeTab, setActiveTab]         = useState<"wc" | "leagues">("wc");
  const [leagueMatches, setLeagueMatches] = useState<EPLMatch[]>([]);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [eplFilter, setEplFilter]         = useState<"all" | "results" | "upcoming">("all");
  const [predictModeId, setPredictModeId] = useState<string | null>(null);
  const [votingMatchId, setVotingMatchId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "leagues") {
      setLoadingLeagues(true);
      setTimeout(() => { setLeagueMatches(EPL_MATCHES); setLoadingLeagues(false); }, 400);
    }
  }, [activeTab, user]);

  const filteredLeague = leagueMatches.filter((m) => {
    if (eplFilter === "results")  return m.status === "Completed" || m.status === "Live";
    if (eplFilter === "upcoming") return m.status === "Upcoming";
    return true;
  });

  const currentMatches = activeTab === "wc" ? wcMatches : filteredLeague;
  const isLoading      = activeTab === "wc" ? isWcLoading : loadingLeagues;

  const handleVote = async (match: EPLMatch, team: "home" | "away") => {
    if (votingMatchId) return;
    setVotingMatchId(match.id);
    try {
      const total = Math.floor(Math.random() * 4000) + 500;
      const ratio = 0.35 + Math.random() * 0.3;
      let homeV = Math.floor(total * ratio);
      let awayV = total - homeV;
      if (team === "home") homeV += 1; else awayV += 1;

      if (activeTab === "leagues") {
        await new Promise((r) => setTimeout(r, 600));
        setLeagueMatches((prev) =>
          prev.map((m) => m.id === match.id ? { ...m, homeVotes: homeV, awayVotes: awayV, userVoted: team } : m)
        );
      } else {
        await castVote(match, team);
      }
    } catch (e) { console.error(e); }
    finally { setVotingMatchId(null); }
  };

  const grouped   = currentMatches.reduce((g, m) => { (g[m.date] ??= []).push(m); return g; }, {} as Record<string, EPLMatch[]>);
  const sortedDates = Object.keys(grouped).sort();
  const pct = (v?: number, t?: number) => (!v || !t) ? 0 : Math.floor((v / t) * 100);

  const resultsCount  = leagueMatches.filter((m) => m.status === "Completed" || m.status === "Live").length;
  const upcomingCount = leagueMatches.filter((m) => m.status === "Upcoming").length;

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
            {([
              { key: "all",      label: "All Fixtures", count: leagueMatches.length },
              { key: "results",  label: "Results",      count: resultsCount },
              { key: "upcoming", label: "Upcoming",     count: upcomingCount },
            ] as const).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setEplFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${eplFilter === key ? "bg-white dark:bg-gray-700 text-saudi-green shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${eplFilter === key ? "bg-saudi-green text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
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
          {sortedDates.length > 0 ? sortedDates.map((date) => (
            <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Date header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-2 w-2 rounded-full bg-saudi-green shrink-0"></div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide whitespace-nowrap">
                  {new Date(date + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h2>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                <span className="text-xs text-gray-400 shrink-0">{grouped[date].length} {grouped[date].length === 1 ? "match" : "matches"}</span>
              </div>

              <div className="grid gap-4">
                {(grouped[date] as EPLMatch[]).map((m) => {
                  const isCompleted = m.status === "Completed";
                  const isUpcoming  = m.status === "Upcoming";
                  const isLive      = m.status === "Live";
                  const totalVotes  = (m.homeVotes || 0) + (m.awayVotes || 0);
                  const homeP       = pct(m.homeVotes, totalVotes);
                  const awayP       = pct(m.awayVotes, totalVotes);
                  const homeWon     = isCompleted && (m.homeScore ?? 0) > (m.awayScore ?? 0);
                  const awayWon     = isCompleted && (m.awayScore ?? 0) > (m.homeScore ?? 0);
                  const isDraw      = isCompleted && m.homeScore === m.awayScore;

                  return (
                    <div key={m.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 overflow-hidden">

                      {/* Status stripe */}
                      {isLive      && <div className="h-1 w-full bg-red-500 animate-pulse" />}
                      {isCompleted && <div className="h-0.5 w-full bg-gradient-to-r from-saudi-green/50 to-transparent" />}
                      {isUpcoming  && <div className="h-0.5 w-full bg-gradient-to-r from-blue-400/40 to-transparent" />}

                      <div className="p-5 md:px-7 flex flex-col md:flex-row items-center gap-5 md:gap-0">

                        {/* Left — time */}
                        <div className="w-full md:w-1/5 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-1">
                          <span className="font-mono text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{m.time}</span>
                          {isLive      && <span className="flex items-center gap-1 text-xs font-bold text-red-600 animate-pulse"><span className="w-2 h-2 bg-red-600 rounded-full" />LIVE</span>}
                          {isCompleted && <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Time</span>}
                          {isUpcoming  && <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Upcoming</span>}
                        </div>

                        {/* Center — teams + score */}
                        <div className="flex-1 w-full flex items-center justify-between gap-4 md:gap-6">
                          {/* Home */}
                          <div className="flex-1 text-right">
                            <span className={`text-base md:text-lg font-bold block leading-tight ${homeWon ? "text-saudi-green" : isDraw ? "text-gray-700 dark:text-gray-200" : awayWon ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
                              {m.homeTeam}
                            </span>
                            {isUpcoming && m._homeWinProb !== undefined && (
                              <span className="text-[10px] text-gray-400">{m._homeWinProb}% win</span>
                            )}
                          </div>

                          {/* Score / VS */}
                          <div className="shrink-0">
                            {isUpcoming ? (
                              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 shadow-inner">VS</div>
                            ) : (
                              <div className={`px-4 py-2 rounded-xl text-white font-mono text-xl font-bold tracking-widest shadow-md border ${isLive ? "bg-red-600 border-red-500" : "bg-gray-900 dark:bg-black border-gray-700"}`}>
                                {m.homeScore} : {m.awayScore}
                              </div>
                            )}
                          </div>

                          {/* Away */}
                          <div className="flex-1 text-left">
                            <span className={`text-base md:text-lg font-bold block leading-tight ${awayWon ? "text-saudi-green" : isDraw ? "text-gray-700 dark:text-gray-200" : homeWon ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
                              {m.awayTeam}
                            </span>
                            {isUpcoming && m._awayWinProb !== undefined && (
                              <span className="text-[10px] text-gray-400">{m._awayWinProb}% win</span>
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
                              <Button size="sm" className="h-9 text-xs gap-1 shadow-md shadow-saudi-green/20">
                                <PlayCircle className="w-3 h-3" /> Watch
                              </Button>
                            ) : (
                              <>
                                {isUpcoming && !m.userVoted && (
                                  <button
                                    onClick={() => setPredictModeId(predictModeId === m.id ? null : m.id)}
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
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${homeWon || awayWon ? "bg-saudi-green/10 text-saudi-green" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                                    {homeWon ? `${m.homeTeam.split(" ")[0]} Win` : awayWon ? `${m.awayTeam.split(" ")[0]} Win` : "Draw"}
                                  </span>
                                )}
                                {isUpcoming && (
                                  <button className="p-2 text-gray-400 hover:text-saudi-green transition-colors" title="Set Reminder">
                                    <Bell className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ── Voting / Odds drawer ── */}
                      {(predictModeId === m.id || m.userVoted) && isUpcoming && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 p-4 animate-in fade-in slide-in-from-top-2">
                          {!m.userVoted ? (
                            <div className="flex flex-col items-center gap-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Who will win?</p>

                              {/* Win probability bar */}
                              {m._homeWinProb !== undefined && (
                                <div className="w-full max-w-sm">
                                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                    <span>{m.homeTeam} {m._homeWinProb}%</span>
                                    <span>Draw {m._drawProb}%</span>
                                    <span>{m.awayTeam} {m._awayWinProb}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-saudi-green transition-all duration-700" style={{ width: `${m._homeWinProb}%` }} />
                                    <div className="h-full bg-gray-400 transition-all duration-700"   style={{ width: `${m._drawProb}%` }} />
                                    <div className="h-full bg-amber-400 transition-all duration-700"  style={{ width: `${m._awayWinProb}%` }} />
                                  </div>
                                  <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-saudi-green inline-block" />Home</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />Draw</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Away</span>
                                  </div>
                                </div>
                              )}

                              {/* Vote buttons */}
                              <div className="flex gap-3 w-full max-w-sm">
                                <button disabled={votingMatchId === m.id} onClick={() => handleVote(m, "home")}
                                  className="flex-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-saudi-green hover:bg-saudi-green/5 hover:text-saudi-green transition-all text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50">
                                  {votingMatchId === m.id ? "Voting..." : m.homeTeam}
                                </button>
                                <button disabled={votingMatchId === m.id} onClick={() => handleVote(m, "away")}
                                  className="flex-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-saudi-green hover:bg-saudi-green/5 hover:text-saudi-green transition-all text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50">
                                  {votingMatchId === m.id ? "Voting..." : m.awayTeam}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{m.homeTeam} ({homeP}%)</span>
                                <span>{m.awayTeam} ({awayP}%)</span>
                              </div>
                              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                <div className="h-full bg-saudi-green transition-all duration-1000 ease-out flex items-center justify-start pl-2" style={{ width: `${homeP}%` }}>
                                  {homeP > 10 && <span className="text-[10px] text-white font-bold">{homeP}%</span>}
                                </div>
                                <div className="h-full bg-gold transition-all duration-1000 ease-out flex items-center justify-end pr-2" style={{ width: `${awayP}%` }}>
                                  {awayP > 10 && <span className="text-[10px] text-white font-bold">{awayP}%</span>}
                                </div>
                              </div>
                              <p className="text-center text-xs text-gray-400">Based on {totalVotes.toLocaleString()} fan votes</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No matches found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different filter or check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;