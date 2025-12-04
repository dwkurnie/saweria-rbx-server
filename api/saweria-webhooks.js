// api/saweria-webhook.js

// Variabel in-memory buat nyimpen donasi terakhir
let latestDonation = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    [
	{
		amount: "69420",
		donator: "Someguy",
		media: {
			src: [
				"https://media2.giphy.com/media/gw3IWyGkC0rsazTi/giphy.webp",
				"https://media2.giphy.com/media/gw3IWyGkC0rsazTi/giphy.mp4",
				"https://media2.giphy.com/media/gw3IWyGkC0rsazTi/giphy.gif",
			],
			tag: "picture",
		},
		message: "THIS IS A FAKE MESSAGE! HAVE A GOOD ONE",
		sound: {
			"1547679809default.ogg":
				"https://saweria-space.sgp1.cdn.digitaloceanspaces.com/prd/sound/836d7a85-dd70-4028-85fb-00fd785f0928-c527b4f6bd6282e21e78c85343d496fa.ogg",
		},
		tts: "...",
	},
];

    const donation = {
      name: body.donor_name || 'Anonymous',
      amount: body.amount || 0,
      message: body.message || '',
      time: new Date().toISOString(),
      has_new: true
    };

    // Simpan sebagai donasi terbaru
    latestDonation = donation;

    console.log('New donation received:', donation);

    // Saweria biasanya cuma butuh response 200 OK
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Export juga supaya file lain bisa baca (dipakai di latest-donation.js)
export { latestDonation };
