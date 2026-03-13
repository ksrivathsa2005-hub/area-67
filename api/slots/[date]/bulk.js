import { getSlots, saveSlots, setCorsHeaders } from '../../_lib/slots.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;
  const { status } = req.body;

  const slots = await getSlots(date);
  slots.forEach(s => {
    s.status = status;
    if (status === 'open') {
      s.userName = null;
      s.userEmail = null;
      s.confirmationCode = null;
      s.bookedAt = null;
    }
  });

  await saveSlots(date, slots);
  res.json({ success: true });
}
