import { useState } from 'react';
import './App.css';
import { getPlayerColor } from './utils/playerColors';
import Scoreboard from './components/Scoreboard';

const tennisPoints = ['0', '15', '30', '40'];

export default function App() {
  const [match, setMatch] = useState({
    tournament: 'ATP Halle',

    round: 'Round of 16',

    courtName: 'Center Court',

    matchTime: '00:00:00',

    playerA: {
      name: 'Fonseca',
      flag: '🇧🇷',
      games: 0,
      sets: 0,
    },

    playerB: {
      name: 'Altmaier',
      flag: '🇩🇪',
      games: 0,
      sets: 0,
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

    view: 'producer',
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

  function flashEvent(eventName, winner = 'A') {
    moveTokens(winner);
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
      top = 'right';
      bottom = 'left';
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

  function handleMatchEvent(matchEvent) {
    const { type, winner } = matchEvent;

    if (type === 'POINT') {
      addPoint(winner);
      return;
    }
    if (type === 'ACE') {
      flashEvent('ACE', winner);
      return;
    }

    if (type === 'WINNER') {
      flashEvent('WINNER', winner);
      return;
    }

    if (type === 'BREAK_POINT') {
      flashEvent('BREAK POINT');
      return;
    }

    if (type === 'DEUCE') {
      flashEvent('DEUCE');
      return;
    }

    if (type === 'SET_WON') {
      flashEvent('SET WON');
      return;
    }

    if (type === 'MATCH_WON') {
      flashEvent('MATCH WON');
    }
  }

  function addPoint(player) {
    moveTokens(player);

    setMatch((prev) => {
      const isA = player === 'A';
      const pointKey = isA ? 'pointA' : 'pointB';
      const otherPointKey = isA ? 'pointB' : 'pointA';

      const playerKey = isA ? 'playerA' : 'playerB';
      const opponentKey = isA ? 'playerB' : 'playerA';
      const playerName = prev[playerKey].name;

      const playerPoint = prev[pointKey];
      const otherPoint = prev[otherPointKey];

      function winGame() {
        const nextGames = prev[playerKey].games + 1;
        const winsSet = nextGames >= 6;

        return {
          ...prev,
          pointA: 0,
          pointB: 0,
          advantage: null,

          [playerKey]: {
            ...prev[playerKey],
            games: winsSet ? 0 : nextGames,
            sets: winsSet ? prev[playerKey].sets + 1 : prev[playerKey].sets,
          },

          [opponentKey]: {
            ...prev[opponentKey],
            games: winsSet ? 0 : prev[opponentKey].games,
          },

          event: winsSet ? `SET ${playerName}` : `GAME ${playerName}`,
          events: [
            winsSet ? `🎉 Set ${playerName}` : `🏆 Game ${playerName}`,
            ...prev.events,
          ].slice(0, 5),
        };
      }

      // Deuce / Advantage zone
      if (playerPoint >= 3 && otherPoint >= 3) {
        if (prev.advantage === null) {
          return {
            ...prev,
            advantage: player,
            event: `ADVANTAGE ${playerName}`,
            events: [`🟢 Advantage ${playerName}`, ...prev.events].slice(0, 5),
          };
        }

        if (prev.advantage === player) {
          return winGame();
        }

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
        return winGame();
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

          <div className="match-meta">
            <span>{match.round}</span>

            <span>{match.courtName}</span>

            <span>{match.matchTime}</span>
          </div>

          <Scoreboard
            playerA={match.playerA}
            playerB={match.playerB}
            score={getScoreDisplay()}
          />

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
            <button
              onClick={() => handleMatchEvent({ type: 'POINT', winner: 'A' })}
            >
              + Point A
            </button>

            <button
              onClick={() => handleMatchEvent({ type: 'POINT', winner: 'B' })}
            >
              + Point B
            </button>

            <button
              onClick={() => handleMatchEvent({ type: 'ACE', winner: 'A' })}
            >
              ⚡ Ace
            </button>

            <button
              onClick={() => handleMatchEvent({ type: 'WINNER', winner: 'A' })}
            >
              Winner
            </button>

            <button onClick={() => handleMatchEvent({ type: 'BREAK_POINT' })}>
              🔥 Break Point
            </button>

            <button onClick={() => handleMatchEvent({ type: 'DEUCE' })}>
              🟠 Deuce
            </button>

            <button onClick={() => handleMatchEvent({ type: 'SET_WON' })}>
              🎉 Set Won
            </button>

            <button onClick={() => handleMatchEvent({ type: 'MATCH_WON' })}>
              🏆 Match Won
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
