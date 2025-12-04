// api/latest-donation.js
import { latestDonation } from './saweria-webhook';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!latestDonation) {
    return res.status(200).json({ has_new: false });
  }

  const response = {
    has_new: latestDonation.has_new,
    name: latestDonation.name,
    amount: latestDonation.amount,
    message: latestDonation.message,
    media: latestDonation.media,
    sound: latestDonation.sound,
    tts: latestDonation.tts,
    time: latestDonation.time,
  };

  // setelah dikirim ke Roblox, tandai sudah tidak "baru" lagi
  latestDonation.has_new = false;

  return res.status(200).json(response);
}
