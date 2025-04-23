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
    // LocationIQ error logged for debugging
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
    res.json(response.data);
  } catch (err) {
    // Search error
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

/*
How to deploy the update to Render:
1. Commit changes:
   git add server.js
   git commit -m "Remove debug logs and cleanup server.js"
   git push

2. Render auto-deploys on push to main. Or manually:
   - Go to your Render dashboard > foodie-location-api service > Deploys
   - Click "Manual Deploy" and deploy the latest commit.

3. Verify:
   curl "https://foodie-location-api.onrender.com/search?q=test&lang=th"
   should return a JSON array of results.
*/
