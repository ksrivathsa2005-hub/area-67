import { getLiveData, setCorsHeaders } from './_lib/slots.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.json(await getLiveData());
}
