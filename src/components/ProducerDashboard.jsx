import Timeline from './Timeline';

export default function ProducerDashboard({
  match,
  controlTab,
  setControlTab,
  updateMatch,
  updatePlayer,
  handleMatchEvent,
  resetPoints,
  scoringProfiles,
}) {
  return (
    <div className="creator-panel">
      <h2>Creator Controls</h2>

      <div className="control-tabs">
        <button
          className={controlTab === 'setup' ? 'active' : ''}
          onClick={() => setControlTab('setup')}
        >
          Setup
        </button>

        <button
          className={controlTab === 'players' ? 'active' : ''}
          onClick={() => setControlTab('players')}
        >
          Players
        </button>

        <button
          className={controlTab === 'live' ? 'active' : ''}
          onClick={() => setControlTab('live')}
        >
          Live
        </button>

        <button
          className={controlTab === 'story' ? 'active' : ''}
          onClick={() => setControlTab('story')}
        >
          Story
        </button>
      </div>

      {controlTab === 'setup' && (
        <div className="control-section">
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
        </div>
      )}

      {controlTab === 'players' && (
        <div className="control-section">
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
        </div>
      )}

      {controlTab === 'live' && (
        <div className="control-section">
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
      )}

      {controlTab === 'story' && (
        <div className="control-section">
          <Timeline events={match.events} />
        </div>
      )}
    </div>
  );
}
