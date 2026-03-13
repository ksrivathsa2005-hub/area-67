// ═══════════════════════════════════════════
// AREA 67 — Game Store (localStorage)
// ═══════════════════════════════════════════

const STORE_VERSION = "area67_v4";

export const CONFIG = {
  WHATSAPP_NUMBER: "9550115678", // ← UPDATE THIS
  ADMIN_PASSWORD: "area67admin",
};

const DEFAULT_GAMES = [
  {
    id: "vr-002",
    name: "iB Cricket",
    subtitle: "Stadium Hero",
    category: "Athletic",
    tag: null,
    intensity: "Mid Power",
    mode: "Solo / Duel",
    img: "https://cdn.akamai.steamstatic.com/steam/apps/957070/header.jpg",
    about: "The most realistic VR cricket experience. Face live bowling physics, play in roaring virtual stadiums, and smash sixes just like your favourite IPL stars. Built for India!",
    rules: [
      "Stand in the designated play area",
      "Hold the controller like a cricket bat",
      "Score as many runs as possible",
      "Ensure wrist strap is attached",
      "Minimum age: 8 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-001",
    name: "Superhot VR",
    subtitle: "Time Bender",
    category: "Combat",
    tag: "🔥 HOT",
    tagColor: "bg-primary text-white",
    intensity: "High Intensity",
    mode: "Solo Hero",
    img: "https://cdn.akamai.steamstatic.com/steam/apps/617830/header.jpg",
    about: "Time moves only when you move. Dodge bullets in slow motion, grab weapons mid-air, and take down enemies in this mind-bending VR shooter. You ARE the time bender.",
    rules: [
      "Solo experience only",
      "Move slowly for better bullet dodging",
      "Grab objects and throw them at enemies",
      "No crouching or jumping for safety",
      "Minimum age: 13 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-003",
    name: "Off Track VR",
    subtitle: "Dirt Road Racer",
    category: "Adventure",
    tag: null,
    intensity: "Pulse Pounder",
    mode: "Solo Ride",
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2715420/capsule_616x353.jpg?t=1707460048",
    about: "Strap in and tear through rugged off-road tracks at insane speeds. Feel every bump and drift in full VR. The most adrenaline-pumping racing experience at Area 67.",
    rules: [
      "Seated experience — stay in your seat",
      "Motion sickness warning: take breaks if needed",
      "Minimum age: 10 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-004",
    name: "Pistol Whip",
    subtitle: "Rhythm Gunslinger",
    category: "Rhythm",
    tag: "NEW!",
    tagColor: "bg-secondary text-black",
    intensity: "High Intensity",
    mode: "Solo Hero",
    img: "https://cdn.akamai.steamstatic.com/steam/apps/1079800/header.jpg",
    about: "An unstoppable action-rhythm shooter. Blast through procedurally generated bullet-hell levels synced to a cinematic soundtrack. Gun-fu meets dance music — pure euphoria.",
    rules: [
      "Solo experience",
      "Dodge and weave — watch your surroundings",
      "Keep wrist straps attached",
      "Minimum age: 12 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-005",
    name: "Beat Saber",
    subtitle: "Slasher Symphony",
    category: "Rhythm",
    tag: null,
    intensity: "High Intensity",
    mode: "Solo / Duel",
    img: "https://cdn.akamai.steamstatic.com/steam/apps/620980/header.jpg",
    about: "Slash through beats in a neon rhythm universe. Wield glowing sabers and cut incoming blocks in sync with electrifying music tracks. Fast, addictive, and incredibly satisfying.",
    rules: [
      "One player at a time",
      "Follow the saber colour — red left, blue right",
      "Don't hit bomb blocks",
      "Minimum age: 10 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-006",
    name: "Fruit Ninja VR",
    subtitle: "Blade Master",
    category: "Rhythm",
    tag: null,
    intensity: "Chill Mission",
    mode: "Solo / Duel",
    img: "https://cdn.akamai.steamstatic.com/steam/apps/486780/header.jpg",
    about: "The classic fruit-slicing game reimagined in VR. Slash flying fruits with flailing blades, rack up combos, and avoid bombs. Perfect for all ages and a crowd favourite.",
    rules: [
      "Wield controllers like swords",
      "Avoid hitting bombs",
      "Keep a firm grip on controllers",
      "Great for beginners and kids (age 6+)",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-007",
    name: "Clay Hunt VR",
    subtitle: "Trap Shooter",
    category: "Combat",
    tag: null,
    intensity: "Mid Power",
    mode: "Solo / Duel",
    img: "https://i.ytimg.com/vi/xZIbWR6H1m0/maxresdefault.jpg",
    about: "Step onto the shooting range and blast clay pigeons out of the sky. Perfect your aim, master different angles, and climb the leaderboard in this satisfying VR trap shooting experience.",
    rules: [
      "Point controllers safely — no rapid swinging",
      "Stand within the marked boundary",
      "Aim carefully before shooting",
      "Minimum age: 10 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-008",
    name: "Table Tennis",
    subtitle: "Ping Pong Pro",
    category: "Athletic",
    tag: null,
    intensity: "Sweat Session",
    mode: "Duel Mode",
    img: "https://cdn.akamai.steamstatic.com/steam/apps/488310/header.jpg",
    about: "The most realistic VR table tennis ever made. Physics-accurate ball flight, topspin, backspin — play against AI or challenge a friend in a head-to-head match.",
    rules: [
      "Hold the controller like a table tennis bat",
      "Stay in your designated side",
      "Wrist strap must be attached",
      "Minimum age: 8 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-009",
    name: "Aim XR",
    subtitle: "Sharp Shooter",
    category: "Combat",
    tag: null,
    intensity: "Mid Power",
    mode: "Solo Hero",
    img: "https://tinyurl.com/mwvx74e7",
    about: "Train your aim with precision shooting drills in VR. Targets appear from all directions — track them, react fast, and sharpen your reflexes. A must-try for shooter fans.",
    rules: [
      "Stand in the designated play area",
      "Track moving targets — stay focused",
      "Minimum age: 12 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-010",
    name: "Ultrawings 2",
    subtitle: "Sky Ace",
    category: "Adventure",
    tag: null,
    intensity: "Chill Mission",
    mode: "Solo Ride",
    img: "https://cdn.akamai.steamstatic.com/steam/apps/1485140/header.jpg",
    about: "Take to the skies in a stunning open-world VR flight experience. Fly planes, helicopters, and more across breathtaking landscapes. The ultimate freedom of flight — no licence required.",
    rules: [
      "Seated experience recommended",
      "Motion sickness warning for sensitive players",
      "Use throttle and controls gently at first",
      "Minimum age: 8 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-011",
    name: "Synth Riders",
    subtitle: "Dance Machine",
    category: "Rhythm",
    tag: null,
    intensity: "High Intensity",
    mode: "Solo Hero",
    img: "https://cdn.akamai.steamstatic.com/steam/apps/885000/header.jpg",
    about: "Ride the music in a full-body VR rhythm experience. Match glowing orbs to pounding EDM and rock tracks — arms swinging, body grooving. The most physical rhythm game at Area 67.",
    rules: [
      "Use your whole body — not just arms",
      "Clear the play area of obstacles",
      "Wrist straps must be attached",
      "Minimum age: 10 years",
      "Duration: 15 minutes per session",
    ],
  },
  {
    id: "vr-012",
    name: "Roller Coaster VR",
    subtitle: "Thrill Ride",
    category: "Adventure",
    tag: "😱 SCARY",
    tagColor: "bg-black text-white",
    intensity: "Pulse Pounder",
    mode: "Solo Ride",
    img: "https://gamefaqs.gamespot.com/a/box/2/4/8/712248_front.jpg",
    about: "Experience the most heart-stopping roller coaster rides without ever leaving the room. Loop-the-loops, vertical drops, and insane speeds — your stomach WILL drop. You have been warned.",
    rules: [
      "Not recommended for those with heart conditions",
      "Not suitable for those with vertigo or severe motion sickness",
      "Seated experience — stay seated throughout",
      "Minimum age: 10 years",
      "Duration: 15 minutes per session",
    ],
  },
];

// ── Games ──

export function getGames() {
  // Version check forces fresh defaults when catalogue is updated
  if (localStorage.getItem("area67_store_version") !== STORE_VERSION) {
    localStorage.removeItem("area67_games");
    localStorage.setItem("area67_store_version", STORE_VERSION);
  }
  const stored = localStorage.getItem("area67_games");
  if (stored) return JSON.parse(stored);
  saveGames(DEFAULT_GAMES);
  return DEFAULT_GAMES;
}

export function saveGames(games) {
  localStorage.setItem("area67_games", JSON.stringify(games));
}

export function addGame(game) {
  const games = getGames();
  const newGame = { ...game, id: `vr-${Date.now()}` };
  saveGames([...games, newGame]);
  return newGame;
}

export function updateGame(id, updates) {
  const games = getGames();
  saveGames(games.map(g => g.id === id ? { ...g, ...updates } : g));
}

export function deleteGame(id) {
  saveGames(getGames().filter(g => g.id !== id));
}

// ── Fest Dates (shared config) ──

export const FEST_DATES = [
  { date: "2026-03-13", day: "THU", num: "13", label: "Mar 13" },
  { date: "2026-03-14", day: "FRI", num: "14", label: "Mar 14" },
  { date: "2026-03-15", day: "SAT", num: "15", label: "Mar 15" },
];
// NOTE: Slot management is now handled by the backend server (server/index.js)
// All slot CRUD operations go through the API via src/lib/socket.js


