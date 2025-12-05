require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// DEMO MAÇLAR (Hata olsa bile çalışır)
const demoMatches = [
  {
    fixture: { id: 853, date: '2025-12-05T21:00:00+00:00' },
    teams: { home: { name: 'Manchester United' }, away: { name: 'West Ham United' } }
  },
  {
    fixture: { id: 746, date: '2025-12-05T13:30:00+00:00' },
    teams: { home: { name: 'Aston Villa' }, away: { name: 'Arsenal FC' } }
  },
  {
    fixture: { id: 777, date: '2025-12-05T19:00:00+00:00' },
    teams: { home: { name: 'CD Leganes' }, away: { name: 'Albacete Balompie' } }
  }
];

app.get('/api/matches', async (req, res) => {
  try {
    const today = '2025-12-05';
    const response = await axios.get(
      `https://v3.football.api-sports.io/fixtures?date=${today}`,
      { headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY } }
    );

    if (response.data.response && response.data.response.length > 0) {
      res.json(response.data.response);
    } else {
      res.json(demoMatches);
    }
  } catch (error) {
    console.error('API Hatası:', error.message);
    res.json(demoMatches);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`VRBet Backend çalışıyor: ${PORT}`);
});
