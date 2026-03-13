import { getSlots, saveSlots, setCorsHeaders } from '../../_lib/slots.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;
  const { time } = req.body;

  let slots = await getSlots(date);
  slots = slots.filter(s => s.time !== time);

  await saveSlots(date, slots);
  res.json({ success: true });
}
