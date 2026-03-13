import { getSlots, saveSlots, setCorsHeaders } from '../../_lib/slots.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;
  const { time, status } = req.body;

  const slots = await getSlots(date);
  const slot = slots.find(s => s.time === time);
  if (!slot) return res.status(404).json({ error: 'Slot not found' });

  slot.status = status;
  if (status === 'open') {
    slot.userName = null;
    slot.userEmail = null;
    slot.confirmationCode = null;
    slot.bookedAt = null;
  }

  await saveSlots(date, slots);
  res.json({ success: true });
}
