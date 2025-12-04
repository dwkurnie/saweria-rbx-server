// api/saweria-webhook.js
import { db } from '../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // Payload Saweria:
    // [
    //   {
    //     amount: "69420",
    //     donator: "Someguy",
    //     media: { ... },
    //     message: "THIS IS A FAKE MESSAGE! HAVE A GOOD ONE",
    //     sound: { ... },
    //     tts: "..."
    //   }
    // ]

    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ error: 'Empty donation payload' });
    }

    const d = body[0];

    const donation = {
      name: d.donator || 'Anonymous',
      amount: Number(d.amount || 0),
      message: d.message || '',
      media: d.media || null,
      sound: d.sound || null,
      tts: d.tts || '',
      createdAt: new Date(),
      isNew: true, // flag bahwa donasi ini belum dikirim ke Roblox
    };

    // Simpan ke koleksi "donations"
    const docRef = await db.collection('donations').add(donation);

    console.log('New donation saved with ID:', docRef.id);

    return res.status(200).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error('Error in saweria-webhook:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
