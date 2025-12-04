// api/saweria-webhook.js
import { db } from '../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // body: array of donations
    // contoh:
    // [ { amount, donator, media, message, sound, tts, type? }, ... ]

    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ error: 'Empty donation payload' });
    }

    const d = body[0]; // ambil elemen pertama dulu

    // Tentukan type:
    // - kalau ada d.type → pakai itu
    // - kalau tidak ada:
    //    - kalau media.type === "yt" → "media"
    //    - kalau ada media.src array → "normal"
    //    - fallback → "normal"
    let donationType = 'normal';
    if (d.type === 'normal' || d.type === 'media') {
      donationType = d.type;
    } else if (d.media && d.media.type === 'yt') {
      donationType = 'media';
    } else if (d.media && Array.isArray(d.media.src)) {
      donationType = 'normal';
    }

    const donation = {
      name: d.donator || 'Anonymous',
      amount: Number(d.amount || 0),
      message: d.message || '',
      type: donationType,
      media: d.media || null,
      sound: d.sound || null,
      tts: d.tts || '',
      createdAt: new Date(),
      isNew: true,
    };

    const docRef = await db.collection('donations').add(donation);

    console.log('New donation saved with ID:', docRef.id, 'data:', donation);

    return res.status(200).json({ success: true, id: docRef.id });
  } catch (err) {
    console.error('Error in saweria-webhook:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
