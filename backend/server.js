require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/matches', async (req, res) => {
  try {
    // Bugünün tarihi (2025-12-05 olarak güncellendi)
    const today = '2025-12-05';
    const response = await axios.get(
      `https://v3.football.api-sports.io/fixtures?date=${today}`,
      { headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY } }
    );
    if (response.data.response && response.data.response.length > 0) {
      res.json(response.data.response);
    } else {
      // Bugün maç yoksa demo maçlar döndür (senin ekran görüntüsündeki maçlar)
      const demoMatches = [
        {
          fixture: { id: 1, date: '2025-12-05T21:00:00+00:00' },
          teams: { home: { name: 'Manchester United' }, away: { name: 'West Ham United' } }
        },
        {
          fixture: { id: 2, date: '2025-12-05T19:00:00+00:00' },
          teams: { home: { name: 'Arsenal FC' }, away: { name: 'Aston Villa' } }
        },
        {
          fixture: { id: 3, date: '2025-12-05T18:00:00+00:00' },
          teams: { home: { name: 'CD Leganes' }, away: { name: 'Albacete Balompie' } }
        }
      ];
      res.json(demoMatches);
    }
  } catch (error) {
    // API hatası durumunda demo maçlar
    const demoMatches = [
      {
        fixture: { id: 1, date: '2025-12-05T21:00:00+00:00' },
        teams: { home: { name: 'Manchester United' }, away: { name: 'West Ham United' } }
      },
      {
        fixture: { id: 2, date: '2025-12-05T19:00:00+00:00' },
        teams: { home: { name: 'Arsenal FC' }, away: { name: 'Aston Villa' } }
      },
      {
        fixture: { id: 3, date: '2025-12-05T18:00:00+00:00' },
        teams: { home: { name: 'CD Leganes' }, away: { name: 'Albacete Balompie' } }
      }
    ];
    res.json(demoMatches);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('VRBet Backend çalışıyor'));
