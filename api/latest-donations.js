// api/latest-donation.js
import { db } from '../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Query 1 donasi terbaru yang isNew == true
    const snapshot = await db
      .collection('donations')
      .where('isNew', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ has_new: false });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Siapkan response untuk Roblox
    const response = {
      has_new: true,
      id: doc.id,
      name: data.name,
      amount: data.amount,
      message: data.message,
      media: data.media,
      sound: data.sound,
      tts: data.tts,
      time: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    };

    // Update isNew -> false supaya tidak dikirim lagi
    await doc.ref.update({ isNew: false });

    return res.status(200).json(response);
  } catch (err) {
    console.error('Error in latest-donation:', err);
    return res.status(500).json({ has_new: false, error: 'Internal server error' });
  }
}
