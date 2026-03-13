import { put, list } from '@vercel/blob';

export const FEST_DATES = [
  { date: "2026-03-13", day: "THU", num: "13", label: "Mar 13" },
  { date: "2026-03-14", day: "FRI", num: "14", label: "Mar 14" },
  { date: "2026-03-15", day: "SAT", num: "15", label: "Mar 15" },
];

export const DEFAULT_SLOT_TIMES = [
  "10:00","10:15","10:30","10:45",
  "11:00","11:15","11:30","11:45",
  "12:00","12:15","12:30","12:45",
  "13:00","13:15","13:30","13:45",
  "14:00","14:15","14:30","14:45",
  "15:00","15:15","15:30","15:45",
  "16:00","16:15","16:30","16:45",
  "17:00",
];

function defaultSlots() {
  return DEFAULT_SLOT_TIMES.map(time => ({
    time,
    status: 'open',
    userName: null,
    userEmail: null,
    confirmationCode: null,
    bookedAt: null,
  }));
}

export async function getSlots(date) {
  try {
    const { blobs } = await list({ prefix: `slots_${date}.json` });
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      return await response.json();
    }
  } catch (e) {
    console.error('Blob read error:', e.message);
  }
  // Return defaults if not found
  const slots = defaultSlots();
  await saveSlots(date, slots);
  return slots;
}

export async function saveSlots(date, slots) {
  await put(`slots_${date}.json`, JSON.stringify(slots), {
    access: 'public',
    addRandomSuffix: false,
  });
}

export function generateConfirmationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'A67-';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function getLiveData() {
  const now = new Date();
  const todayDate = now.toISOString().slice(0, 10);

  const activeDate = FEST_DATES.find(d => d.date === todayDate)?.date || FEST_DATES[0].date;
  const slots = await getSlots(activeDate);

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

  queue.sort((a, b) => a.time.localeCompare(b.time));

  const completed = slots.filter(s => {
    if (s.status !== 'booked' && s.status !== 'playing') return false;
    const [h, m] = s.time.split(':').map(Number);
    return (now.getHours() * 60 + now.getMinutes()) >= (h * 60 + m + 15);
  });

  return {
    activeDate,
    dateInfo: FEST_DATES.find(d => d.date === activeDate),
    nowPlaying,
    queue: queue.slice(0, 10),
    completed,
    stats: {
      total: slots.length,
      open: slots.filter(s => s.status === 'open').length,
      booked: slots.filter(s => s.status === 'booked' || s.status === 'playing').length,
    },
    allSlots: slots,
  };
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function bookingConfirmationEmail({ userName, date, dayLabel, time, confirmationCode }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#EEF4FF;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    
    <!-- Header Banner -->
    <div style="background:#1B5CA8;border:4px solid #000;padding:30px 20px;text-align:center;box-shadow:8px 8px 0 #000;">
      <div style="display:inline-block;background:#FF6B00;border:3px solid #000;padding:8px 24px;transform:rotate(-2deg);box-shadow:4px 4px 0 #000;margin-bottom:15px;">
        <span style="color:#fff;font-size:28px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">⚡ AREA 67 ⚡</span>
      </div>
      <h1 style="color:#fff;font-size:32px;font-weight:900;margin:10px 0 5px;text-transform:uppercase;letter-spacing:2px;">
        BOOKING CONFIRMED!
      </h1>
      <p style="color:#FFD700;font-size:16px;font-weight:700;margin:0;text-transform:uppercase;letter-spacing:1px;">
        🔥 IT'S CLOBBERIN' TIME! 🔥
      </p>
    </div>

    <!-- Main Content -->
    <div style="background:#fff;border:4px solid #000;border-top:0;padding:30px;box-shadow:8px 8px 0 #000;">
      
      <!-- Greeting -->
      <div style="background:#FF6B00;border:3px solid #000;padding:12px 20px;margin-bottom:20px;box-shadow:4px 4px 0 #000;">
        <p style="color:#fff;font-size:20px;font-weight:900;margin:0;text-transform:uppercase;">
          🦸 Hey ${userName}! You're IN!
        </p>
      </div>

      <p style="font-size:16px;color:#333;line-height:1.6;margin-bottom:25px;">
        Your VR slot at <strong>Area 67</strong> has been <strong style="color:#FF6B00;">CONFIRMED</strong>! 
        Get ready for the most mind-bending experience at Apoorv Fest. The Fantastic Four await your arrival.
      </p>

      <!-- Booking Details Card -->
      <div style="background:#EEF4FF;border:4px solid #000;padding:0;margin-bottom:25px;box-shadow:4px 4px 0 #000;">
        <div style="background:#1B5CA8;padding:12px 20px;border-bottom:4px solid #000;">
          <p style="color:#fff;font-size:18px;font-weight:900;margin:0;text-transform:uppercase;letter-spacing:2px;">
            📋 YOUR MISSION BRIEF
          </p>
        </div>
        <div style="padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:2px dashed #1B5CA8;font-weight:700;color:#666;text-transform:uppercase;font-size:12px;letter-spacing:1px;width:120px;">DATE</td>
              <td style="padding:10px 0;border-bottom:2px dashed #1B5CA8;font-weight:900;color:#000;font-size:18px;">${dayLabel}, ${date}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:2px dashed #1B5CA8;font-weight:700;color:#666;text-transform:uppercase;font-size:12px;letter-spacing:1px;">TIME</td>
              <td style="padding:10px 0;border-bottom:2px dashed #1B5CA8;font-weight:900;color:#FF6B00;font-size:24px;">${time}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:2px dashed #1B5CA8;font-weight:700;color:#666;text-transform:uppercase;font-size:12px;letter-spacing:1px;">DURATION</td>
              <td style="padding:10px 0;border-bottom:2px dashed #1B5CA8;font-weight:900;color:#000;font-size:18px;">15 Minutes</td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-weight:700;color:#666;text-transform:uppercase;font-size:12px;letter-spacing:1px;">VENUE</td>
              <td style="padding:10px 0;font-weight:900;color:#000;font-size:18px;">Area 67, Apoorv Fest</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Confirmation Code -->
      <div style="text-align:center;margin:30px 0;">
        <p style="font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">
          YOUR CONFIRMATION CODE
        </p>
        <div style="display:inline-block;background:#000;border:4px solid #FF6B00;padding:15px 40px;box-shadow:6px 6px 0 #1B5CA8;">
          <span style="color:#FFD700;font-size:36px;font-weight:900;letter-spacing:8px;font-family:monospace;">
            ${confirmationCode}
          </span>
        </div>
        <p style="font-size:13px;color:#666;margin-top:10px;">
          Show this code at the Area 67 desk when you arrive
        </p>
      </div>

      <!-- What to Expect -->
      <div style="background:#FFF8E1;border:3px solid #000;padding:20px;margin-bottom:20px;box-shadow:3px 3px 0 #000;">
        <p style="font-size:16px;font-weight:900;color:#000;margin:0 0 10px;text-transform:uppercase;">
          🎮 WHAT TO EXPECT:
        </p>
        <ul style="margin:0;padding:0 0 0 20px;font-size:14px;color:#444;line-height:2;">
          <li>Arrive <strong>5 minutes early</strong> to gear up</li>
          <li>Choose your VR experience at the desk</li>
          <li>15-minute immersive session</li>
          <li>Safety briefing before you start</li>
          <li>Staff will guide you through everything</li>
        </ul>
      </div>

      <!-- Safety Note -->
      <div style="background:#FFEBEE;border:3px solid #000;padding:15px 20px;margin-bottom:20px;box-shadow:3px 3px 0 #000;">
        <p style="font-size:14px;color:#C62828;font-weight:700;margin:0;">
          ⚠️ <strong>SAFETY:</strong> If you feel dizzy or nauseous during VR, signal the staff immediately. 
          Not recommended for those with heart conditions, epilepsy, or severe motion sickness.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#000;border:4px solid #000;border-top:0;padding:25px;text-align:center;box-shadow:8px 8px 0 #1B5CA8;">
      <p style="color:#FF6B00;font-size:20px;font-weight:900;margin:0 0 5px;text-transform:uppercase;letter-spacing:2px;">
        🔥 FLAME ON! 🔥
      </p>
      <p style="color:#888;font-size:12px;margin:10px 0 0;">
        Area 67 — VR Experience Zone | Apoorv Fest 2026 | IIIT Kottayam
      </p>
      <p style="color:#555;font-size:11px;margin:5px 0 0;">
        This is an automated confirmation email. Please do not reply to this email.
      </p>
    </div>

  </div>
</body>
</html>
`;
}
