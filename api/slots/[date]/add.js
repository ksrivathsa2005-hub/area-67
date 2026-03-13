import { getSlots, saveSlots, setCorsHeaders } from '../../_lib/slots.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;
  const { time } = req.body;

  const slots = await getSlots(date);
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

  await saveSlots(date, slots);
  res.json({ success: true });
}
