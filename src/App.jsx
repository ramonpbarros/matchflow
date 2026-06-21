import { useState } from 'react';
import './App.css';

const tennisPoints = ['0', '15', '30', '40'];
function getPlayerColor(flag) {
  const colors = {
    '🇧🇷': '#00a86b',

    '🇩🇪': '#d4a017',

    '🇫🇷': '#2563eb',

    '🇪🇸': '#d62828',

    '🇮🇹': '#2a9d8f',

    '🇺🇸': '#4361ee',

    '🇦🇷': '#5fa8d3',

    '🇬🇧': '#264653',

    '🇷🇸': '#3a86ff',

    '🇦🇺': '#3d5a80',
  };

  return colors[flag] || '#9ca3af';
}

export default function App() {
  const [match, setMatch] = useState({
    tournament: 'ATP Halle',
    playerA: {
      name: 'Fonseca',
      flag: '🇧🇷',
    },
    playerB: {
      name: 'Altmaier',
      flag: '🇩🇪',
    },
    pointA: 0,
    pointB: 0,
    advantage: null,
    event: '',
    events: [],
    tokenPositions: {
      top: 'center',
      bottom: 'center',
    },
  });

  function getScoreDisplay() {
    if (match.pointA >= 3 && match.pointB >= 3) {
      if (match.advantage === 'A') return `ADV ${match.playerA.name}`;
      if (match.advantage === 'B') return `ADV ${match.playerB.name}`;
      return 'DEUCE';
    }

    return `${tennisPoints[match.pointA]} - ${tennisPoints[match.pointB]}`;
  }

  function updateMatch(field, value) {
    setMatch((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updatePlayer(playerKey, field, value) {
    setMatch((prev) => ({
      ...prev,
      [playerKey]: {
        ...prev[playerKey],
        [field]: value,
      },
    }));
  }

  function flashEvent(eventName) {
    moveTokens('A');
    addTimelineEvent(eventName);

    setMatch((prev) => ({
      ...prev,
      event: eventName,
    }));

    setTimeout(() => {
      setMatch((prev) => ({
        ...prev,
        event: '',
      }));
    }, 1200);
  }

  function moveTokens(winner) {
    let top;
    let bottom;

    if (winner === 'A') {
      top = 'left';
      bottom = 'right';
    } else {
      top = 'left';
      bottom = 'right';
    }

    setMatch((prev) => ({
      ...prev,
      tokenPositions: {
        top,
        bottom,
      },
    }));
  }

  function addTimelineEvent(text) {
    setMatch((prev) => ({
      ...prev,
      events: [text, ...prev.events].slice(0, 5),
    }));
  }

  function addPoint(player) {
    moveTokens(player);
    setMatch((prev) => {
      const isA = player === 'A';
      const pointKey = isA ? 'pointA' : 'pointB';
      const otherPointKey = isA ? 'pointB' : 'pointA';
      const playerName = isA ? prev.playerA.name : prev.playerB.name;

      const playerPoint = prev[pointKey];
      const otherPoint = prev[otherPointKey];

      // Deuce / Advantage zone
      if (playerPoint >= 3 && otherPoint >= 3) {
        // No advantage yet -> player gets advantage
        if (prev.advantage === null) {
          return {
            ...prev,
            advantage: player,
            event: `ADVANTAGE ${playerName}`,
            events: [`🟢 Advantage ${playerName}`, ...prev.events].slice(0, 5),
          };
        }

        // Player already had advantage -> wins game
        if (prev.advantage === player) {
          return {
            ...prev,
            pointA: 0,
            pointB: 0,
            advantage: null,
            event: `GAME ${playerName}`,
            events: [`🏆 Game ${playerName}`, ...prev.events].slice(0, 5),
          };
        }

        // Other player had advantage -> back to deuce
        return {
          ...prev,
          advantage: null,
          event: 'DEUCE',
          events: ['🟠 Deuce', ...prev.events].slice(0, 5),
        };
      }

      // Normal scoring before deuce
      const newPoint = playerPoint + 1;

      if (newPoint >= 4 && otherPoint <= 2) {
        return {
          ...prev,
          pointA: 0,
          pointB: 0,
          advantage: null,
          event: `GAME ${playerName}`,
          events: [`🏆 Game ${playerName}`, ...prev.events].slice(0, 5),
        };
      }

      return {
        ...prev,
        [pointKey]: newPoint,
        event: `POINT ${player}`,
        events: [`🎾 Point ${playerName}`, ...prev.events].slice(0, 5),
      };
    });

    setTimeout(() => {
      setMatch((prev) => ({
        ...prev,
        event: '',
      }));
    }, 1200);
  }

  function resetPoints() {
    setMatch((prev) => ({
      ...prev,
      pointA: 0,
      pointB: 0,
      advantage: null,
      event: 'RESET',
    }));

    setTimeout(() => {
      setMatch((prev) => ({
        ...prev,
        event: '',
      }));
    }, 700);
  }

  return (
    <div className="app">
      <div className="workspace">
        <div className="phone">
          <div className="live">● LIVE</div>

          <h1>MatchFlow</h1>
          <p className="tournament">{match.tournament}</p>

          <div className="scoreboard">
            <span>
              {match.playerA.name} {match.playerA.flag}
            </span>

            <strong>{getScoreDisplay()}</strong>

            <span>
              {match.playerB.name} {match.playerB.flag}
            </span>
          </div>

          <div
            className={`court ${match.event
              .toLowerCase()
              .replaceAll(' ', '-')}`}
          >
            <div className="court-lines">
              <div className="line baseline top-line" />
              <div className="line baseline bottom-line" />
              <div className="line sideline left-line" />
              <div className="line sideline right-line" />
              <div className="line doubles-left" />
              <div className="line doubles-right" />
              <div className="line service top-service" />
              <div className="line service bottom-service" />
              <div className="line center-service" />
              <div className="line net-line" />
            </div>

            <div
              className={`player top ${match.tokenPositions.top}`}
              style={{
                background: getPlayerColor(match.playerB.flag),
              }}
            ></div>
            <div className="ball">🎾</div>
            <div className="ball-shadow"></div>
            <div
              className={`player bottom ${match.tokenPositions.bottom}`}
              style={{
                background: getPlayerColor(match.playerA.flag),
              }}
            ></div>

            {match.event && <div className="event-badge">{match.event}</div>}
          </div>
        </div>
        <div className="timeline">
          <h3>📖 Match Story</h3>

          {match.events.map((item, index) => (
            <div key={index} className="timeline-item">
              {item}
            </div>
          ))}
        </div>
        <div className="creator-panel">
          <h2>Creator Controls</h2>

          <label>Tournament</label>
          <input
            value={match.tournament}
            onChange={(e) => updateMatch('tournament', e.target.value)}
          />

          <label>Player A Name</label>
          <input
            value={match.playerA.name}
            onChange={(e) => updatePlayer('playerA', 'name', e.target.value)}
          />

          <label>Player A Flag</label>
          <input
            value={match.playerA.flag}
            onChange={(e) => updatePlayer('playerA', 'flag', e.target.value)}
          />

          <label>Player B Name</label>
          <input
            value={match.playerB.name}
            onChange={(e) => updatePlayer('playerB', 'name', e.target.value)}
          />

          <label>Player B Flag</label>
          <input
            value={match.playerB.flag}
            onChange={(e) => updatePlayer('playerB', 'flag', e.target.value)}
          />

          <div className="button-grid">
            <button onClick={() => addPoint('A')}>+ Point A</button>
            <button onClick={() => addPoint('B')}>+ Point B</button>

            <button onClick={() => flashEvent('ACE')}>⚡ Ace</button>
            <button onClick={() => flashEvent('WINNER')}>Winner</button>

            <button onClick={() => flashEvent('BREAK POINT')}>
              🔥 Break Point
            </button>

            <button onClick={() => flashEvent('DEUCE')}>🟠 Deuce</button>
            <button onClick={() => flashEvent('SET WON')}>🎉 Set Won</button>
            <button onClick={() => flashEvent('MATCH WON')}>
              🏆 Match Won
            </button>

            <button onClick={resetPoints}>Reset Points</button>
          </div>
        </div>
      </div>
    </div>
  );
}
