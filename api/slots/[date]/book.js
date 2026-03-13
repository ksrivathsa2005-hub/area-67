import nodemailer from 'nodemailer';
import { getSlots, saveSlots, generateConfirmationCode, FEST_DATES, setCorsHeaders, bookingConfirmationEmail } from '../../_lib/slots.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { date } = req.query;
  const { time, userName, userEmail } = req.body;

  if (!time || !userName || !userEmail) {
    return res.status(400).json({ error: 'time, userName, and userEmail are required' });
  }

  const slots = await getSlots(date);
  const slot = slots.find(s => s.time === time);
  if (!slot) return res.status(404).json({ error: 'Slot not found' });
  if (slot.status === 'booked') return res.status(409).json({ error: 'Slot already booked' });

  const confirmationCode = generateConfirmationCode();
  slot.status = 'booked';
  slot.userName = userName;
  slot.userEmail = userEmail;
  slot.confirmationCode = confirmationCode;
  slot.bookedAt = new Date().toISOString();

  await saveSlots(date, slots);

  // Send confirmation email
  const dateInfo = FEST_DATES.find(d => d.date === date);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

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
    res.json({ success: true, confirmationCode, emailSent: true });
  } catch (err) {
    console.error('Email error:', err.message);
    res.json({ success: true, confirmationCode, emailSent: false, emailError: err.message });
  }
}
