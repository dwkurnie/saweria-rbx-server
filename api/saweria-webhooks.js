// api/saweria-webhook.js

// Variabel in-memory buat nyimpen donasi terakhir
let latestDonation = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    const entries = Array.isArray(body) ? body : [];

    if (!entries.length) {
      return res.status(400).json({ error: 'Empty donation payload' });
    }

    const d = entries[0]; // ambil donasi pertama (kalau ada lebih dari 1, bisa di-loop)

    const donation = {
      name: d.donator || 'Anonymous',
      amount: Number(d.amount || 0),
      message: d.message || '',
      media: d.media || null,
      sound: d.sound || null,
      tts: d.tts || '',
      time: new Date().toISOString(),
      has_new: true,
    };

    // Simpan sebagai donasi terbaru
    latestDonation = donation;

    console.log('New donation received:', donation);

    // Saweria biasanya cuma perlu 200 OK
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// diexport supaya bisa dipakai di endpoint lain (latest-donation.js)
export { latestDonation };
