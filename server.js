// Generated on 2025-04-23 14:30:00 (ICT)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Reverse geocoding (pin → address)
app.get('/location', async (req, res) => {
  const { lat, lon, lang } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

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
        'accept-language': lang || 'en',
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("↕️ LocationIQ error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Forward geocoding (query → suggestions)
app.get('/search', async (req, res) => {
  const { q, lang } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  if (!q) {
    return res.status(400).json({ error: 'Missing q (query)' });
  }

  try {
    const response = await axios.get(`https://us1.locationiq.com/v1/search.php`, {
      params: {
        key: apiKey,
        q,
        format: 'json',
        'accept-language': lang || 'en',
      },
    });
    // return the raw array of results; Flutter will pick display_name, lat & lon
    res.json(response.data);
  } catch (err) {
    console.error("🔍 Search error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Debug endpoint to verify key loading
app.get('/debug-key', (req, res) => {
  res.send(`Key being used: ${process.env.LOCATIONIQ_API_KEY || 'NOT SET'}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
