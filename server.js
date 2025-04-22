app.get('/location', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  console.log("📦 API Key Loaded:", apiKey); // <- ใส่ตรวจตรงนี้เลย

  if (!lat || !lon) return res.status(400).send('Missing lat/lon');

  try {
    const response = await axios.get(`https://us1.locationiq.com/v1/reverse.php`, {
      params: {
        key: apiKey,
        lat,
        lon,
        format: 'json',
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("↕️ LocationIQ error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});
