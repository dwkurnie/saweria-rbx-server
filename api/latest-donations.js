// api/latest-donation.js
import { db } from '../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ambil 1 donasi terbaru yang isNew == true
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

    const response = {
      has_new: true,
      id: doc.id,
      type: data.type || 'donation',

      name: data.name,
      amount: data.amount,
      message: data.message,

      amount_raw: data.amount_raw ?? null,
      fee_cut: data.fee_cut ?? null,
      email: data.email ?? null,
      is_user: data.is_user ?? null,

      created_at_saweria: data.created_at_saweria || null,
      time: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    };

    // tandai sudah tidak baru supaya tidak dikirim lagi
    await doc.ref.update({ isNew: false });

    return res.status(200).json(response);
  } catch (err) {
    console.error('Error in latest-donation:', err);
    return res
      .status(500)
      .json({ has_new: false, error: 'Internal server error' });
  }
}
