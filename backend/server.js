require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/matches', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(
      `https://v3.football.api-sports.io/fixtures?date=${today}`,
      { headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY } }
    );
    res.json(response.data.response);
  } catch (error) {
    const demoMatches = [
      { fixture: { id: 1, date: new Date().toISOString() }, teams: { home: { name: 'Man Utd' }, away: { name: 'Aston Villa' } } },
      { fixture: { id: 2, date: new Date().toISOString() }, teams: { home: { name: 'Arsenal' }, away: { name: 'Liverpool' } } }
    ];
    res.json(demoMatches);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('VRBet Backend çalışıyor'));
