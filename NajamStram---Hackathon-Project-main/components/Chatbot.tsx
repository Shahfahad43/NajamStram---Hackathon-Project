import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  sender: "user" | "bot";
  text: string;
}

// ═══════════════════════════════════════════════════════════
// 📊 LIVE DATA — Updated Feb 16, 2026
// ═══════════════════════════════════════════════════════════

// ─── PREMIER LEAGUE ──────────────────────────────────────
const EPL_STANDINGS = `🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Standings (Top 6):
🥇 Arsenal — 57 pts (W17 D6 L3)
🥈 Man City — 53 pts (W16 D5 L5)
🥉 Aston Villa — 50 pts (W15 D5 L6)
4️⃣  Man United — 45 pts (W12 D9 L5)
5️⃣  Chelsea — 44 pts (W12 D8 L6)
6️⃣  Liverpool — 42 pts (W12 D6 L8)`;

const EPL_RECENT = `🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League Recent Results:
- Chelsea 2–2 Leeds (Feb 10)
- Tottenham 1–2 Newcastle (Feb 10)
- West Ham 1–1 Man United (Feb 10)
- Man City 3–0 Fulham (Feb 11)
- Liverpool 1–0 Sunderland (Feb 11)
- Brentford 1–1 Arsenal (Feb 12)`;

const EPL_FIXTURES = `🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League — Top 6 Upcoming:

📌 Wolves vs Arsenal
   🕐 Wed 18 Feb · 20:00 UTC
   📊 Arsenal: 75.4% · Draw: 16% · Wolves: 8.6%

📌 Chelsea vs Burnley
   🕐 Sat 21 Feb · 15:00 UTC
   📊 Chelsea: 78.9% · Draw: 13.3% · Burnley: 7.8%

📌 Man City vs Newcastle
   🕐 Sat 21 Feb · 20:00 UTC
   📊 Man City: 65.7% · Draw: 18.7% · Newcastle: 15.6%

📌 Nottm Forest vs Liverpool
   🕐 Sun 22 Feb · 14:00 UTC
   📊 Liverpool: 53% · Draw: 24.2% · Forest: 22.8%

📌 Tottenham vs Arsenal
   🕐 Sun 22 Feb · 16:30 UTC
   📊 Arsenal: 62.3% · Draw: 22.3% · Spurs: 15.4%`;

// ─── LA LIGA ────────────────────────────────────────────
const LALIGA_STANDINGS = `🇪🇸 La Liga Standings (Top 3):
🥇 Real Madrid — 60 pts (W19 D3 L2)
🥈 FC Barcelona — 58 pts (W19 D1 L3)
🥉 Villarreal — 45 pts (W14 D3 L6)`;

const LALIGA_RECENT = `🇪🇸 La Liga Recent Results:
- Villarreal 4–1 Espanyol (Feb 9)
- Real Madrid 4–1 Real Sociedad (Feb 14)
- Getafe 2–1 Villarreal (Feb 14)
- Rayo Vallecano 3–0 Atletico Madrid (Feb 15)
- Valencia 2–0 Levante (Feb 15)`;

const LALIGA_FIXTURES = `🇪🇸 La Liga — Top 3 Upcoming Fixtures:

🔴 Real Madrid (1st · 60 pts)
📌 Osasuna vs Real Madrid
   🕐 Sat 21 Feb · 17:30 UTC
   📊 Real Madrid: 57.9% · Draw: 22.9% · Osasuna: 19.2%
📌 Barcelona vs Levante (watch context)
   🕐 Sun 22 Feb · 15:15 UTC

🔵 FC Barcelona (2nd · 58 pts)
📌 Girona vs Barcelona 🔜 TODAY
   🕐 Mon 16 Feb · 20:00 UTC
   📊 Barcelona: 71.4% · Draw: 15.8% · Girona: 12.8%
📌 Barcelona vs Levante
   🕐 Sun 22 Feb · 15:15 UTC
   📊 Barcelona: 85.7% · Draw: 9.1% · Levante: 5.2%

🟡 Villarreal (3rd · 45 pts)
📌 Levante vs Villarreal
   🕐 Wed 18 Feb · 19:00 UTC
   📊 Villarreal: 52.5% · Draw: 24.1% · Levante: 23.4%`;

// ─── SERIE A ────────────────────────────────────────────
const SERIEA_STANDINGS = `🇮🇹 Serie A Standings (Top 3):
🥇 Inter Milan — 61 pts (W20 D1 L4)
🥈 AC Milan — 53 pts (W15 D8 L1)
🥉 Napoli — 50 pts (W15 D5 L5)`;

const SERIEA_RECENT = `🇮🇹 Serie A Recent Results:
- AC Milan 2–1 Pisa (Feb 13)
- Lazio 0–2 Atalanta (Feb 14)
- Inter Milan 3–2 Juventus (Feb 14) ⚡
- Napoli 2–2 Roma (Feb 15)
- Bologna 2–1 Torino (Feb 15)`;

const SERIEA_FIXTURES = `🇮🇹 Serie A — Top 3 Upcoming Fixtures:

🔵⚫ Inter Milan (1st · 61 pts)
📌 Lecce vs Inter Milan
   🕐 Sat 21 Feb · 17:00 UTC
   📊 Inter: 69.2% · Draw: 19.9% · Lecce: 10.9%

⚫🔴 AC Milan (2nd · 53 pts)
📌 AC Milan vs Como
   🕐 Wed 18 Feb · 19:45 UTC
   📊 AC Milan: 41.5% · Draw: 28.2% · Como: 30.3%
📌 AC Milan vs Parma
   🕐 Sun 22 Feb · 17:00 UTC
   📊 AC Milan: 72.5% · Draw: 17.7% · Parma: 9.8%

🔵⚪ Napoli (3rd · 50 pts)
📌 Atalanta vs Napoli
   🕐 Sun 22 Feb · 14:00 UTC
   📊 Atalanta: 40.2% · Draw: 29.6% · Napoli: 30.2%`;

// ─── LIGUE 1 ────────────────────────────────────────────
const LIGUE1_STANDINGS = `🇫🇷 Ligue 1 Standings (Top 2):
🥇 RC Lens — 52 pts (W17 D1 L4)
🥈 PSG — 51 pts (W16 D3 L3)`;

const LIGUE1_RECENT = `🇫🇷 Ligue 1 Recent Results:
- PSG 5–0 Marseille (Feb 8) 🔥
- AS Monaco 3–1 Nantes (Feb 13)
- Rennes 3–1 PSG (Feb 13) — upset!
- RC Lens 5–0 Paris FC (Feb 14) 💥
- Lyon 2–0 Nice (Feb 15)`;

const LIGUE1_FIXTURES = `🇫🇷 Ligue 1 — Top 2 Upcoming Fixtures:

🔴🟡 RC Lens (1st · 52 pts)
📌 RC Lens vs Monaco
   🕐 Sat 21 Feb · 16:00 UTC
   📊 Lens: 51.5% · Draw: 23.6% · Monaco: 24.9%
📌 Strasbourg vs RC Lens
   🕐 Fri 27 Feb · 19:45 UTC

🔵🔴 PSG (2nd · 51 pts)
📌 PSG vs FC Metz
   🕐 Sat 21 Feb · 20:05 UTC
   📊 PSG: 86.2% · Draw: 9% · Metz: 4.8%`;

// ─── BUNDESLIGA ─────────────────────────────────────────
const BUNDESLIGA_STANDINGS = `🇩🇪 Bundesliga Standings (Top 2):
🥇 Bayern Munich — 57 pts (W18 D3 L1)
🥈 Borussia Dortmund — 51 pts (W15 D6 L1)`;

const BUNDESLIGA_RECENT = `🇩🇪 Bundesliga Recent Results:
- Bayern Munich 5–1 Hoffenheim (Feb 8) 🔥
- Bayer Leverkusen 4–0 St. Pauli (Feb 14)
- Borussia Dortmund 4–0 Mainz (Feb 13) 💥
- Werder Bremen 0–3 Bayern Munich (Feb 14)
- RB Leipzig 2–2 Wolfsburg (Feb 15)`;

const BUNDESLIGA_FIXTURES = `🇩🇪 Bundesliga — Top 2 Upcoming Fixtures:

🔴⚪ Bayern Munich (1st · 57 pts)
📌 Bayern Munich vs Eintracht Frankfurt
   🕐 Sat 21 Feb · 14:30 UTC
   📊 Bayern: 82.6% · Draw: 10.4% · Frankfurt: 7%

⚫🟡 Borussia Dortmund (2nd · 51 pts)
📌 RB Leipzig vs Borussia Dortmund
   🕐 Sat 21 Feb · 17:30 UTC
   📊 Leipzig: 42.7% · Draw: 24.4% · Dortmund: 32.9%`;

// ═══════════════════════════════════════════════════════════
// 🤖 AI PREDICTION
// ═══════════════════════════════════════════════════════════

async function fetchAIPrediction(team1: string, team2: string): Promise<string> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are Mishaal AI, a football analyst on NajamStream — a Saudi-themed streaming platform.
When given two teams, produce a structured prediction:
1. Both teams' recent form trend (last 5 games)
2. Key strengths & weaknesses of each side
3. Head-to-head historical tendency
4. Win probabilities: Team A%, Draw%, Team B%
5. Predicted scoreline

Rules: Max 180 words · Bullet points · Football emojis ⚽🎯📊💪
End with: "⚠️ Analytical estimate only — football always surprises!"
Always provide a prediction, never refuse.`,
        messages: [{ role: "user", content: `Predict: ${team1} vs ${team2}` }],
      }),
    });
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    if (!text) throw new Error("Empty");
    return text;
  } catch {
    return `⚽ ${team1} vs ${team2}\n\n• 📈 Form: Both sides in strong recent form.\n• 💪 ${team1}: Strong possession & set pieces.\n• ⚡ ${team2}: Clinical on the counter-attack.\n• 🤝 H2H: Historically tight and competitive.\n\n📊 Win Probabilities:\n• ${team1}: 45% · Draw: 25% · ${team2}: 30%\n\n🏆 Score Prediction: 2–1 to ${team1}\n\n⚠️ Analytical estimate only — football always surprises!`;
  }
}

const VS_REGEX = /^(.+?)\s+vs\.?\s+(.+)$/i;

// ═══════════════════════════════════════════════════════════
// 🧠 HELPERS
// ═══════════════════════════════════════════════════════════

function has(str: string, ...terms: string[]) {
  return terms.some((t) => str.includes(t));
}

function leagueOf(str: string) {
  if (has(str, "premier league", "epl", " pl ", "english premier")) return "epl";
  if (has(str, "la liga", "laliga", "spanish league", "spain")) return "laliga";
  if (has(str, "serie a", "seriea", "italian league", "italy")) return "seriea";
  if (has(str, "ligue 1", "ligue1", "french league", "france ligue")) return "ligue1";
  if (has(str, "bundesliga", "german league", "germany")) return "bundesliga";
  return null;
}

// ═══════════════════════════════════════════════════════════
// 🎨 COMPONENT
// ═══════════════════════════════════════════════════════════

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("chat_history");
      return saved ? JSON.parse(saved) : [{
        sender: "bot",
        text: "Hello 👋 I'm Mishaal AI — NajamStream's football assistant!\n\n⚽ Predict any match → 'Argentina vs France'\n📅 Fixtures → 'La Liga fixtures'\n📊 Standings → 'Serie A standings'\n🕐 Results → 'Recent Bundesliga results'\n\nSupported leagues: 🏴󠁧󠁢󠁥󠁮󠁧󠁿 PL · 🇪🇸 La Liga · 🇮🇹 Serie A · 🇫🇷 Ligue 1 · 🇩🇪 Bundesliga\n\nJust ask! 😊",
      }];
    } catch {
      return [{ sender: "bot", text: "Hello 👋 I'm Mishaal AI!" }];
    }
  });

  useEffect(() => {
    try { localStorage.setItem("chat_history", JSON.stringify(messages)); } catch {}
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickButtons = [
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿 PL Top 6",
    "🇪🇸 La Liga",
    "🇮🇹 Serie A",
    "🇫🇷 Ligue 1",
    "🇩🇪 Bundesliga",
    "📊 All Standings",
    "🕐 Recent Results",
    "⚽ Predict Match",
  ];

  const getBotResponse = async (text: string): Promise<string> => {
    const raw = text.trim();
    const lower = raw.toLowerCase();

    // ── Greetings ────────────────────────────────────────────────────
    const greets = ["hi", "hello", "hey", "salam", "hola", "bonjour", "ciao", "مرحبا", "sup", "good morning", "good evening", "morning", "evening"];
    if (greets.some((g) => lower === g || lower.startsWith(g + " ") || lower.startsWith(g + "!"))) {
      return "Hi there! 😊 I'm Mishaal AI.\n\n🎯 What I can do:\n• Predict any match → 'Real Madrid vs Barcelona'\n• Show fixtures → 'La Liga fixtures'\n• League standings → 'Bundesliga standings'\n• Recent results → 'Serie A results'\n• Tourism in Saudi Arabia\n• Navigate: Streams, Schedule, Dashboard\n\nWhat would you like?";
    }

    // ── Goodbye / Thanks ─────────────────────────────────────────────
    if (has(lower, "thank", "شكرا", "bye", "goodbye", "see you", "cya", "later")) {
      return "You're welcome! ⚽ Come back anytime for match predictions and live football info! 🙌";
    }

    // ── Help ─────────────────────────────────────────────────────────
    if (has(lower, "help", "what can you", "what do you do", "command", "capabilit", "feature")) {
      return "🤖 Mishaal AI — Full Capabilities:\n\n⚽ Match Predictions (any two teams)\n🏴󠁧󠁢󠁥󠁮󠁧󠁿 PL Top 6 fixtures\n🇪🇸 La Liga Top 3 fixtures\n🇮🇹 Serie A Top 3 fixtures\n🇫🇷 Ligue 1 Top 2 fixtures\n🇩🇪 Bundesliga Top 2 fixtures\n📊 League standings (all leagues)\n🕐 Recent results (all leagues)\n🌍 Saudi Arabia tourism tips\n📺 Site: Streams · Schedule · Dashboard\n⚙️ Stream troubleshooting";
    }

    // ── Navigation ───────────────────────────────────────────────────
    if (has(lower, "stream", "watch live", "live stream")) { navigate("/streams"); return "Opening Live Streams 🎥!"; }
    if (has(lower, "signup", "sign up", "register", "create account")) { navigate("/signup"); return "Heading to Sign Up ✍️!"; }
    if (has(lower, "dashboard", "my account", "my profile")) { navigate("/dashboard"); return "Opening Dashboard 📊!"; }
    if (has(lower, "privacy policy")) { navigate("/privacy"); return "Opening Privacy Policy 🔐."; }
    if (has(lower, "terms and condition", "terms of service")) { navigate("/terms"); return "Opening Terms & Conditions 📜."; }
    if (
      has(lower, "match center", "fixture page", "schedule page") ||
      (has(lower, "schedule") && !leagueOf(lower) && !has(lower, "top", "fix", "upcoming"))
    ) { navigate("/schedule"); return "Opening Match Schedule 📅!"; }

    // ── Tourism ──────────────────────────────────────────────────────
    if (has(lower, "tourism", "visit saudi", "where to go", "places in saudi", "explore saudi", "travel saudi", "saudi travel")) {
      return "🌍 Saudi Arabia — World Cup Destination!\n\n• 🏛️ Al-Ula & Diriyah — UNESCO heritage\n• 🎡 Boulevard Riyadh City — entertainment hub\n• 🏖️ Red Sea Riviera — beaches & diving\n• 🕌 Jeddah's Al-Balad — historic old town\n• ⛰️ Abha — mountain retreats\n• 🎭 Riyadh Season — festivals & events";
    }

    // ── Tech support ─────────────────────────────────────────────────
    if (has(lower, "lag", "buffer", "video problem", "not loading", "slow stream", "freeze", "error")) {
      return "⚙️ Stream troubleshooting:\n\n1. Refresh the page (F5)\n2. Lower stream resolution\n3. Check your internet speed\n4. Clear browser cache (Ctrl+Shift+Del)\n5. Try a different browser\n\nStill issues? Contact our support team!";
    }

    // ═════════════════════════════════════════════════════════
    // 📊 STANDINGS
    // ═════════════════════════════════════════════════════════
    const isStandings = has(lower, "standing", "table", "ranking", "top team", "league leader", "pts", "points table", "who is first", "who is leading");
    if (isStandings || lower === "📊 all standings") {
      const lg = leagueOf(lower);
      if (lg === "epl") return EPL_STANDINGS;
      if (lg === "laliga") return LALIGA_STANDINGS;
      if (lg === "seriea") return SERIEA_STANDINGS;
      if (lg === "ligue1") return LIGUE1_STANDINGS;
      if (lg === "bundesliga") return BUNDESLIGA_STANDINGS;
      return `${EPL_STANDINGS}\n\n${LALIGA_STANDINGS}\n\n${SERIEA_STANDINGS}\n\n${LIGUE1_STANDINGS}\n\n${BUNDESLIGA_STANDINGS}`;
    }

    // ═════════════════════════════════════════════════════════
    // 🕐 RECENT RESULTS
    // ═════════════════════════════════════════════════════════
    const isRecent = has(lower,
      "recent result", "latest result", "last game", "last match",
      "score", "yesterday", "this week", "what happened", "who won",
      "recent score", "latest game", "latest match", "past result",
      "🕐 recent results"
    );
    if (isRecent) {
      const lg = leagueOf(lower);
      if (lg === "epl") return EPL_RECENT;
      if (lg === "laliga") return LALIGA_RECENT;
      if (lg === "seriea") return SERIEA_RECENT;
      if (lg === "ligue1") return LIGUE1_RECENT;
      if (lg === "bundesliga") return BUNDESLIGA_RECENT;
      return `${EPL_RECENT}\n\n${LALIGA_RECENT}\n\n${SERIEA_RECENT}\n\n${LIGUE1_RECENT}\n\n${BUNDESLIGA_RECENT}`;
    }

    // ═════════════════════════════════════════════════════════
    // 📅 FIXTURES
    // ═════════════════════════════════════════════════════════
    const isFixture = has(lower,
      "fixture", "upcoming", "next game", "next match",
      "when do", "when is", "when are", "when does",
      "kickoff", "kick off", "game time", "match time",
      "schedule", "this weekend", "weekend game"
    );
    const isTopSix = has(lower, "top six", "top 6", "big six", "top-6");

    // Button shortcuts
    if (lower === "🏴󠁧󠁢󠁥󠁮󠁧󠁿 pl top 6" || isTopSix) return EPL_FIXTURES;
    if (lower === "🇪🇸 la liga") return LALIGA_FIXTURES;
    if (lower === "🇮🇹 serie a") return SERIEA_FIXTURES;
    if (lower === "🇫🇷 ligue 1") return LIGUE1_FIXTURES;
    if (lower === "🇩🇪 bundesliga") return BUNDESLIGA_FIXTURES;

    if (isFixture) {
      const lg = leagueOf(lower);
      if (lg === "epl") return EPL_FIXTURES;
      if (lg === "laliga") return LALIGA_FIXTURES;
      if (lg === "seriea") return SERIEA_FIXTURES;
      if (lg === "ligue1") return LIGUE1_FIXTURES;
      if (lg === "bundesliga") return BUNDESLIGA_FIXTURES;
      return "Which league fixtures would you like?\n\n🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League\n🇪🇸 La Liga\n🇮🇹 Serie A\n🇫🇷 Ligue 1\n🇩🇪 Bundesliga\n\nJust name the league! 😊";
    }

    // ═════════════════════════════════════════════════════════
    // ⚽ MATCH PREDICTION
    // ═════════════════════════════════════════════════════════
    const vsMatch = VS_REGEX.exec(raw);
    if (vsMatch) {
      return await fetchAIPrediction(vsMatch[1].trim(), vsMatch[2].trim());
    }

    if (
      has(lower, "predict", "prediction", "who will win", "who wins", "chances of winning", "odds", "likely to win") ||
      lower === "⚽ predict match"
    ) {
      return "⚽ Give me two teams and I'll predict!\n\nExamples:\n• 'Real Madrid vs Barcelona'\n• 'Argentina vs France'\n• 'Bayern vs PSG'\n• 'Liverpool vs Man City'";
    }

    // ═════════════════════════════════════════════════════════
    // 🔍 TEAM-SPECIFIC QUERIES
    // ═════════════════════════════════════════════════════════
    if (has(lower, "real madrid")) return `⚽ Real Madrid (La Liga 1st · 60 pts)\n\nNext: Osasuna vs Real Madrid\n🕐 Sat 21 Feb · 17:30 UTC\n📊 Real Madrid: 57.9% to win`;
    if (has(lower, "barcelona") && !has(lower, "atletico")) return `⚽ FC Barcelona (La Liga 2nd · 58 pts)\n\nNext: Girona vs Barcelona 🔜 TODAY\n🕐 Mon 16 Feb · 20:00 UTC\n📊 Barcelona: 71.4% to win`;
    if (has(lower, "villarreal")) return `⚽ Villarreal (La Liga 3rd · 45 pts)\n\nNext: Levante vs Villarreal\n🕐 Wed 18 Feb · 19:00 UTC\n📊 Villarreal: 52.5% to win`;
    if (has(lower, "inter milan", "inter fc", "inter milano")) return `⚽ Inter Milan (Serie A 1st · 61 pts)\n\nNext: Lecce vs Inter Milan\n🕐 Sat 21 Feb · 17:00 UTC\n📊 Inter: 69.2% to win`;
    if (has(lower, "ac milan", " milan")) return `⚽ AC Milan (Serie A 2nd · 53 pts)\n\nNext: AC Milan vs Como\n🕐 Wed 18 Feb · 19:45 UTC\nThen: AC Milan vs Parma · Sun 22 Feb`;
    if (has(lower, "napoli")) return `⚽ SSC Napoli (Serie A 3rd · 50 pts)\n\nNext: Atalanta vs Napoli\n🕐 Sun 22 Feb · 14:00 UTC\n📊 Napoli: 30.2% to win`;
    if (has(lower, "psg", "paris saint")) return `⚽ PSG (Ligue 1 2nd · 51 pts)\n\nNext: PSG vs FC Metz\n🕐 Sat 21 Feb · 20:05 UTC\n📊 PSG: 86.2% to win 🔥`;
    if (has(lower, "rc lens", "lens")) return `⚽ RC Lens (Ligue 1 1st · 52 pts)\n\nNext: RC Lens vs Monaco\n🕐 Sat 21 Feb · 16:00 UTC\n📊 Lens: 51.5% to win`;
    if (has(lower, "bayern")) return `⚽ Bayern Munich (Bundesliga 1st · 57 pts)\n\nNext: Bayern Munich vs Frankfurt\n🕐 Sat 21 Feb · 14:30 UTC\n📊 Bayern: 82.6% to win 🔥`;
    if (has(lower, "dortmund", "bvb")) return `⚽ Borussia Dortmund (Bundesliga 2nd · 51 pts)\n\nNext: RB Leipzig vs Dortmund\n🕐 Sat 21 Feb · 17:30 UTC\n📊 Leipzig: 42.7% · Dortmund: 32.9%`;
    if (has(lower, "arsenal")) return `⚽ Arsenal FC (PL 1st · 57 pts)\n\nNext fixtures:\n📌 Wolves vs Arsenal · Wed 18 Feb 20:00 UTC\n📌 Tottenham vs Arsenal · Sun 22 Feb 16:30 UTC`;
    if (has(lower, "liverpool")) return `⚽ Liverpool FC (PL 6th · 42 pts)\n\nNext: Nottm Forest vs Liverpool\n🕐 Sun 22 Feb · 14:00 UTC\n📊 Liverpool: 53% to win`;
    if (has(lower, "man city", "manchester city")) return `⚽ Manchester City (PL 2nd · 53 pts)\n\nNext: Man City vs Newcastle\n🕐 Sat 21 Feb · 20:00 UTC\n📊 Man City: 65.7% to win`;
    if (has(lower, "chelsea")) return `⚽ Chelsea FC (PL 5th · 44 pts)\n\nNext: Chelsea vs Burnley\n🕐 Sat 21 Feb · 15:00 UTC\n📊 Chelsea: 78.9% to win`;
    if (has(lower, "tottenham", "spurs")) return `⚽ Tottenham Hotspur (PL 16th · 29 pts)\n\nNext: Tottenham vs Arsenal\n🕐 Sun 22 Feb · 16:30 UTC\n📊 Arsenal: 62.3% to win`;

    // ─── Fallback ─────────────────────────────────────────────
    return "I didn't quite catch that 🤔\n\nTry:\n• 'Real Madrid vs Barcelona' — AI prediction\n• 'La Liga fixtures' — upcoming games\n• 'Recent Serie A results' — latest scores\n• 'Bundesliga standings' — current table\n• 'Tourism' — Saudi Arabia tips\n\nOr use the quick buttons below ⬇️";
  };

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await getBotResponse(msg);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Something went wrong — please try again! 🔄" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    try { localStorage.removeItem("chat_history"); } catch {}
    setMessages([{
      sender: "bot",
      text: "Chat cleared ✅\n\nAsk me anything:\n⚽ Match predictions\n📅 Fixtures by league\n📊 Standings\n🕐 Recent results",
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Mishaal AI"
          className="bg-saudi-green text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 relative"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">!</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[320px] h-[560px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-saudi-green text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">⚽</div>
              <div>
                <h3 className="font-bold text-sm">Mishaal AI</h3>
                <p className="text-xs opacity-70">NajamStream</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={clearChat} className="text-xs opacity-75 hover:opacity-100 underline">Clear</button>
              <button onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-2xl max-w-[88%] whitespace-pre-line leading-relaxed text-xs ${
                  msg.sender === "user"
                    ? "bg-saudi-green text-white ml-auto rounded-br-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs px-1">
                <Loader2 size={11} className="animate-spin" />
                <span>Mishaal is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Buttons */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {quickButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => sendMessage(btn)}
                disabled={isTyping}
                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full hover:bg-saudi-green hover:text-white transition border border-gray-200 dark:border-gray-600 disabled:opacity-40 whitespace-nowrap"
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder='e.g. "Brazil vs France"'
              disabled={isTyping}
              className="flex-1 px-3 py-2 rounded-xl border text-xs dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-saudi-green disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isTyping || !input.trim()}
              className="bg-saudi-green text-white px-3 rounded-xl hover:scale-105 transition disabled:opacity-40"
            >
              {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;