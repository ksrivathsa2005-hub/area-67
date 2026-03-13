// ═══════════════════════════════════════════
// AREA 67 — Backend Server
// Express + Socket.IO + Nodemailer
// ═══════════════════════════════════════════

import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { bookingConfirmationEmail } from './emailTemplate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const PORT = process.env.PORT || 3001;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── Express + Socket.IO setup ──
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// ── SMTP transporter ──
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP on startup
transporter.verify().then(() => {
  console.log('📧 SMTP ready');
}).catch(err => {
  console.warn('⚠️  SMTP not ready:', err.message);
});

// ── Config ──
const FEST_DATES = [
  { date: "2026-03-13", day: "THU", num: "13", label: "Mar 13" },
  { date: "2026-03-14", day: "FRI", num: "14", label: "Mar 14" },
  { date: "2026-03-15", day: "SAT", num: "15", label: "Mar 15" },
];

const DEFAULT_SLOT_TIMES = [
  "10:00","10:15","10:30","10:45",
  "11:00","11:15","11:30","11:45",
  "12:00","12:15","12:30","12:45",
  "13:00","13:15","13:30","13:45",
  "14:00","14:15","14:30","14:45",
  "15:00","15:15","15:30","15:45",
  "16:00","16:15","16:30","16:45",
  "17:00",
];

// ── File-based slot storage ──
function slotFilePath(date) {
  return path.join(DATA_DIR, `slots_${date}.json`);
}

function getSlots(date) {
  const fp = slotFilePath(date);
  if (fs.existsSync(fp)) {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  }
  // Seed defaults
  const slots = DEFAULT_SLOT_TIMES.map(time => ({
    time,
    status: 'open',
    userName: null,
    userEmail: null,
    confirmationCode: null,
    bookedAt: null,
  }));
  saveSlots(date, slots);
  return slots;
}

function saveSlots(date, slots) {
  fs.writeFileSync(slotFilePath(date), JSON.stringify(slots, null, 2));
}

function generateConfirmationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'A67-';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Helper: broadcast slot update to all clients
function broadcastSlots(date) {
  const slots = getSlots(date);
  io.emit('slotsUpdated', { date, slots });
  broadcastLive();
}

// Helper: compute live data
function getLiveData() {
  const now = new Date();
  const currentHHMM = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const todayDate = now.toISOString().slice(0, 10);
  
  // Find the active fest date (today or nearest)
  const activeDate = FEST_DATES.find(d => d.date === todayDate)?.date || FEST_DATES[0].date;
  const slots = getSlots(activeDate);

  // Current player: booked slot whose time window includes now (15 min windows)
  let nowPlaying = null;
  let queue = [];

  for (const slot of slots) {
    if (slot.status !== 'booked' && slot.status !== 'playing') continue;

    const [h, m] = slot.time.split(':').map(Number);
    const slotStart = h * 60 + m;
    const slotEnd = slotStart + 15;
    const nowMin = now.getHours() * 60 + now.getMinutes();

    if (nowMin >= slotStart && nowMin < slotEnd) {
      nowPlaying = { ...slot, status: 'playing' };
    } else if (nowMin < slotStart) {
      queue.push(slot);
    }
  }

  // Sort queue by time
  queue.sort((a, b) => a.time.localeCompare(b.time));

  // Completed slots (booked + past)
  const completed = slots.filter(s => {
    if (s.status !== 'booked' && s.status !== 'playing') return false;
    const [h, m] = s.time.split(':').map(Number);
    return (now.getHours() * 60 + now.getMinutes()) >= (h * 60 + m + 15);
  });

  return {
    activeDate,
    dateInfo: FEST_DATES.find(d => d.date === activeDate),
    nowPlaying,
    queue: queue.slice(0, 10), // Next 10 in queue
    completed,
    stats: {
      total: slots.length,
      open: slots.filter(s => s.status === 'open').length,
      booked: slots.filter(s => s.status === 'booked' || s.status === 'playing').length,
    },
    allSlots: slots,
  };
}

function broadcastLive() {
  io.emit('liveUpdate', getLiveData());
}

// ── REST API Endpoints ──

// Get fest dates config
app.get('/api/config', (req, res) => {
  res.json({ festDates: FEST_DATES });
});

// Get slots for a date
app.get('/api/slots/:date', (req, res) => {
  res.json(getSlots(req.params.date));
});

// Book a slot (admin action — with user name + email)
app.post('/api/slots/:date/book', async (req, res) => {
  const { date } = req.params;
  const { time, userName, userEmail } = req.body;
  
  if (!time || !userName || !userEmail) {
    return res.status(400).json({ error: 'time, userName, and userEmail are required' });
  }

  const slots = getSlots(date);
  const slot = slots.find(s => s.time === time);
  if (!slot) return res.status(404).json({ error: 'Slot not found' });
  if (slot.status === 'booked') return res.status(409).json({ error: 'Slot already booked' });

  const confirmationCode = generateConfirmationCode();
  slot.status = 'booked';
  slot.userName = userName;
  slot.userEmail = userEmail;
  slot.confirmationCode = confirmationCode;
  slot.bookedAt = new Date().toISOString();

  saveSlots(date, slots);
  broadcastSlots(date);

  // Send confirmation email
  const dateInfo = FEST_DATES.find(d => d.date === date);
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: `🎮 AREA 67 — Booking Confirmed! Code: ${confirmationCode}`,
      html: bookingConfirmationEmail({
        userName,
        date,
        dayLabel: dateInfo ? `${dateInfo.day}, ${dateInfo.label}` : date,
        time,
        confirmationCode,
      }),
    });
    console.log(`📧 Confirmation email sent to ${userEmail} [${confirmationCode}]`);
    res.json({ success: true, confirmationCode, emailSent: true });
  } catch (err) {
    console.error('Email error:', err.message);
    res.json({ success: true, confirmationCode, emailSent: false, emailError: err.message });
  }
});

// Toggle slot status (admin — open/booked without email)
app.post('/api/slots/:date/status', (req, res) => {
  const { date } = req.params;
  const { time, status } = req.body;

  const slots = getSlots(date);
  const slot = slots.find(s => s.time === time);
  if (!slot) return res.status(404).json({ error: 'Slot not found' });

  slot.status = status;
  if (status === 'open') {
    slot.userName = null;
    slot.userEmail = null;
    slot.confirmationCode = null;
    slot.bookedAt = null;
  }

  saveSlots(date, slots);
  broadcastSlots(date);
  res.json({ success: true });
});

// Bulk set all slots (admin)
app.post('/api/slots/:date/bulk', (req, res) => {
  const { date } = req.params;
  const { status } = req.body;
  
  const slots = getSlots(date);
  slots.forEach(s => {
    s.status = status;
    if (status === 'open') {
      s.userName = null;
      s.userEmail = null;
      s.confirmationCode = null;
      s.bookedAt = null;
    }
  });

  saveSlots(date, slots);
  broadcastSlots(date);
  res.json({ success: true });
});

// Add a time slot for a date
app.post('/api/slots/:date/add', (req, res) => {
  const { date } = req.params;
  const { time } = req.body;

  const slots = getSlots(date);
  if (slots.some(s => s.time === time)) {
    return res.status(409).json({ error: 'Time already exists' });
  }

  slots.push({
    time,
    status: 'open',
    userName: null,
    userEmail: null,
    confirmationCode: null,
    bookedAt: null,
  });
  slots.sort((a, b) => a.time.localeCompare(b.time));

  saveSlots(date, slots);
  broadcastSlots(date);
  res.json({ success: true });
});

// Remove a time slot for a date
app.post('/api/slots/:date/remove', (req, res) => {
  const { date } = req.params;
  const { time } = req.body;

  let slots = getSlots(date);
  slots = slots.filter(s => s.time !== time);

  saveSlots(date, slots);
  broadcastSlots(date);
  res.json({ success: true });
});

// Reset slots for a date to defaults
app.post('/api/slots/:date/reset', (req, res) => {
  const { date } = req.params;
  const slots = DEFAULT_SLOT_TIMES.map(time => ({
    time,
    status: 'open',
    userName: null,
    userEmail: null,
    confirmationCode: null,
    bookedAt: null,
  }));
  saveSlots(date, slots);
  broadcastSlots(date);
  res.json({ success: true });
});

// Get live data
app.get('/api/live', (req, res) => {
  res.json(getLiveData());
});

// ── Socket.IO connections ──
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send initial live data
  socket.emit('liveUpdate', getLiveData());

  // Client can request slots for a specific date
  socket.on('getSlots', (date) => {
    socket.emit('slotsUpdated', { date, slots: getSlots(date) });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Broadcast live status every 30 seconds (for "now playing" auto-transitions)
setInterval(broadcastLive, 30000);

// ── Start server ──
httpServer.listen(PORT, () => {
  console.log(`\n🚀 AREA 67 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO ready`);
  console.log(`📧 SMTP: ${process.env.SMTP_USER}\n`);
});
