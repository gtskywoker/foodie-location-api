require('dotenv').config(); // โหลด .env สำหรับ local

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/location', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  if (!lat || !lon) return res.status(400).send('Missing lat/lon');

  try {
    const response = await axios.get(`https://us1.locationiq.com/v1/reverse`, {
      params: {
        key: apiKey,
        lat,
        lon,
        format: 'json',
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
