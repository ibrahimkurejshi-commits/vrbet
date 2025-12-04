import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [balance, setBalance] = useState(10000);
  const [matches, setMatches] = useState([]);
  const [betSlip, setBetSlip] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('demoBalance');
    if (saved) setBalance(Number(saved));
    else localStorage.setItem('demoBalance', 10000);

    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastReset');
    if (lastReset !== today) {
      localStorage.setItem('demoBalance', 10000);
      localStorage.setItem('lastReset', today);
      setBalance(10000);
    }
  }, []);

  useEffect(() => {
    axios.get('https://vrbet-backend.onrender.com/api/matches')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setMatches(res.data.slice(0, 5));
        } else {
          setMatches([{ teams: { home: { name: 'Man Utd' }, away: { name: 'Aston Villa' } }, fixture: { id: 1, date: new Date().toISOString() } }]);
        }
      })
      .catch(() => {
        setMatches([{ teams: { home: { name: 'Demo Maç' }, away: { name: 'Demo Takım' } }, fixture: { id: 1, date: new Date().toISOString() } }]);
      });
  }, []);

  const addToSlip = (match, selection, odds) => {
    setBetSlip([...betSlip, { match, selection, odds, stake: 100 }]);
  };

  const placeBet = () => {
    const total = betSlip.reduce((a, b) => a + b.stake, 0);
    if (total > balance) return alert('Yetersiz bakiye!');
    setBalance(balance - total);
    localStorage.setItem('demoBalance', balance - total);
    alert('Bahis oynandı! (Simülasyon)');
    setBetSlip([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-black text-white p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">VRBet</h1>
        <div className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold text-lg">
          {balance} DEMO €
        </div>
      </header>

      <div className="space-y-4">
        {matches.map(match => (
          <div key={match.fixture.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold">{match.teams.home.name}</span>
              <span className="text-gray-400">{new Date(match.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              <span className="font-semibold">{match.teams.away.name}</span>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={() => addToSlip(match, '1', 1.8)} className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-700">1 1.8</button>
              <button onClick={() => addToSlip(match, 'X', 3.5)} className="bg-gray-600 px-4 py-2 rounded font-bold hover:bg-gray-700">X 3.5</button>
              <button onClick={() => addToSlip(match, '2', 2.1)} className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-700">2 2.1</button>
            </div>
          </div>
        ))}
      </div>

      {betSlip.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black p-4 border-t-4 border-yellow-400">
          <h3 className="text-lg font-bold mb-2">Kupon ({betSlip.length})</h3>
          {betSlip.map((b, i) => (
            <div key={i} className="text-sm">{b.match.teams.home.name} vs {b.match.teams.away.name} → {b.selection}</div>
          ))}
          <button onClick={placeBet} className="bg-green-600 w-full py-3 mt-3 rounded-lg font-bold text-lg">
            OYNA → {betSlip.reduce((a, b) => a + b.stake, 0)} €
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
