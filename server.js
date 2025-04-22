const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/location', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  console.log("📦 API Key Loaded:", apiKey);

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon' });
  }

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

app.get('/debug-key', (req, res) => {
  res.send(`Key being used: ${process.env.LOCATIONIQ_API_KEY}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
