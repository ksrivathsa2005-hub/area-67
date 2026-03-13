import { DEFAULT_SLOT_TIMES, saveSlots, setCorsHeaders } from '../../_lib/slots.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;
  const slots = DEFAULT_SLOT_TIMES.map(time => ({
    time,
    status: 'open',
    userName: null,
    userEmail: null,
    confirmationCode: null,
    bookedAt: null,
  }));

  await saveSlots(date, slots);
  res.json({ success: true });
}
