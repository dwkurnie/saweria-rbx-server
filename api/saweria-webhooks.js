// api/saweria-webhook.js
import { db } from '../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    console.log('===== INCOMING SAWERIA WEBHOOK =====');
    console.log('Raw body:', body);

    // Body contoh:
    // {
    //   version: '2022.01',
    //   created_at: '2021-01-01T12:00:00+00:00',
    //   id: '00000000-0000-0000-0000-000000000000',
    //   type: 'donation',
    //   amount_raw: 69420,
    //   cut: 3471,
    //   donator_name: 'Someguy',
    //   donator_email: 'someguy@example.com',
    //   donator_is_user: false,
    //   message: 'THIS IS A FAKE MESSAGE! HAVE A GOOD ONE',
    //   etc: { amount_to_display: 69420 }
    // }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const donation = {
      version: body.version || null,
      saweriaId: body.id || null,
      type: body.type || 'donation',

      // pilih amount yang enak dipakai untuk display
      amount: body?.etc?.amount_to_display ?? body.amount_raw ?? 0,
      amount_raw: body.amount_raw ?? null,
      fee_cut: body.cut ?? null,

      name: body.donator_name || 'Anonymous',
      email: body.donator_email || null,
      is_user: body.donator_is_user ?? null,

      message: body.message || '',
      created_at_saweria: body.created_at || null, // string asli dari Saweria
      createdAt: new Date(), // waktu server (Vercel) saat diterima

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
