// api/saweria-webhook.js

export default async function handler(req, res) {
	console.log("===== INCOMING WEBHOOK =====");
	console.log("Method:", req.method);
	console.log("Headers:", req.headers);

	try {
		console.log("Body:", req.body); // <--- ini yang kamu butuhkan

		return res.status(200).json({
			success: true,
			received: true,
		});
	} catch (err) {
		console.error("Error printing body:", err);
		return res.status(500).json({ error: "Failed to print body" });
	}
}
