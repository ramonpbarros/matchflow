import { useState } from 'react';
import './App.css';
import Timeline from './components/Timeline';
import BroadcastView from './components/BroadcastView';

const tennisPoints = ['0', '15', '30', '40'];

const scoringProfiles = {
  ATP_TOUR_SINGLES: {
    label: 'ATP Tour Singles',
    setsToWin: 2,
    gamesToWinSet: 6,
    winSetBy: 2,
    tieBreakAt: 6,
    tieBreakPointsToWin: 7,
    decidingSetTieBreakPointsToWin: 7,
    noAd: false,
  },

  GRAND_SLAM_MENS_SINGLES: {
    label: "Grand Slam Men's Singles",
    setsToWin: 3,
    gamesToWinSet: 6,
    winSetBy: 2,
    tieBreakAt: 6,
    tieBreakPointsToWin: 7,
    decidingSetTieBreakPointsToWin: 10,
    noAd: false,
  },

  GRAND_SLAM_WOMENS_SINGLES: {
    label: "Grand Slam Women's Singles",
    setsToWin: 2,
    gamesToWinSet: 6,
    winSetBy: 2,
    tieBreakAt: 6,
    tieBreakPointsToWin: 7,
    decidingSetTieBreakPointsToWin: 10,
    noAd: false,
  },

  DOUBLES_NO_AD: {
    label: 'Doubles No-Ad',
    setsToWin: 2,
    gamesToWinSet: 6,
    winSetBy: 2,
    tieBreakAt: 6,
    tieBreakPointsToWin: 7,
    decidingSetTieBreakPointsToWin: 10,
    noAd: true,
  },
};

export default function App() {
  const [match, setMatch] = useState({
    tournament: 'ATP Halle',

    round: 'Round of 16',

    courtName: 'Center Court',

    matchTime: '00:00:00',

    scoringProfile: 'ATP_TOUR_SINGLES',

    eventType: 'Singles',

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

    tieBreak: false,

    broadcastEvent: '',

    events: [],

    tokenPositions: {
      top: 'center',
      bottom: 'center',
    },

    view: 'producer',
  });

  function getScoreDisplay() {
    const rules = scoringProfiles[match.scoringProfile];

    if (rules.noAd && match.pointA >= 3 && match.pointB >= 3) {
      return 'DECIDING POINT';
    }

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
      broadcastEvent: eventName,
    }));

    setTimeout(() => {
      setMatch((prev) => ({
        ...prev,
        broadcastEvent: '',
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

      const rules = scoringProfiles[prev.scoringProfile];

      function winGame() {
        const nextGames = prev[playerKey].games + 1;
        const opponentGames = prev[opponentKey].games;

        const winsSet =
          nextGames >= rules.gamesToWinSet &&
          nextGames - opponentGames >= rules.winSetBy;

        const entersTieBreak =
          nextGames === rules.tieBreakAt && opponentGames === rules.tieBreakAt;

        return {
          ...prev,

          tieBreak: entersTieBreak,

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

          broadcastEvent: winsSet ? `SET ${playerName}` : `GAME ${playerName}`,

          events: [
            winsSet ? `🎉 Set ${playerName}` : `🏆 Game ${playerName}`,
            ...prev.events,
          ].slice(0, 5),
        };
      }

      if (rules.noAd && playerPoint >= 3 && otherPoint >= 3) {
        return winGame();
      }

      // Deuce / Advantage zone
      if (playerPoint >= 3 && otherPoint >= 3) {
        if (prev.advantage === null) {
          return {
            ...prev,
            advantage: player,
            broadcastEvent: `ADVANTAGE ${playerName}`,
            events: [`🟢 Advantage ${playerName}`, ...prev.events].slice(0, 5),
          };
        }

        if (prev.advantage === player) {
          return winGame();
        }

        return {
          ...prev,
          advantage: null,
          broadcastEvent: 'DEUCE',
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
        broadcastEvent: `POINT ${player}`,
        events: [`🎾 Point ${playerName}`, ...prev.events].slice(0, 5),
      };
    });

    setTimeout(() => {
      setMatch((prev) => ({
        ...prev,
        broadcastEvent: '',
      }));
    }, 1200);
  }

  function resetPoints() {
    setMatch((prev) => ({
      ...prev,
      pointA: 0,
      pointB: 0,
      advantage: null,
      broadcastEvent: 'RESET',
    }));

    setTimeout(() => {
      setMatch((prev) => ({
        ...prev,
        broadcastEvent: '',
      }));
    }, 700);
  }

  return (
    <div className="app">
      <div className="workspace">
        <div className="broadcast-row">
          <div className="phone">
            <BroadcastView match={match} score={getScoreDisplay()} />
          </div>

          <Timeline events={match.events} />
        </div>
        <div className="creator-panel">
          <h2>Creator Controls</h2>

          <label>Tournament</label>
          <input
            value={match.tournament}
            onChange={(e) => updateMatch('tournament', e.target.value)}
          />

          <label>Event Type</label>
          <select
            value={match.eventType}
            onChange={(e) => updateMatch('eventType', e.target.value)}
          >
            <option value="Singles">Singles</option>
            <option value="Doubles">Doubles</option>
            <option value="Mixed Doubles">Mixed Doubles</option>
          </select>

          <label>Round</label>
          <input
            value={match.round}
            onChange={(e) => updateMatch('round', e.target.value)}
          />

          <label>Court</label>
          <input
            value={match.courtName}
            onChange={(e) => updateMatch('courtName', e.target.value)}
          />

          <label>Match Time</label>
          <input
            value={match.matchTime}
            onChange={(e) => updateMatch('matchTime', e.target.value)}
          />

          <label>Scoring Format</label>
          <select
            value={match.scoringProfile}
            onChange={(e) => updateMatch('scoringProfile', e.target.value)}
          >
            {Object.entries(scoringProfiles).map(([key, profile]) => (
              <option key={key} value={key}>
                {profile.label}
              </option>
            ))}
          </select>

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
            <button onClick={resetPoints}>Reset Points</button>
          </div>
        </div>
      </div>
    </div>
  );
}
