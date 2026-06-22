import CourtScene from './CourtScene';
import Scoreboard from './Scoreboard';

export default function BroadcastView({ match, score }) {
  return (
    <div className="broadcast-view">
      <div className="broadcast-topbar">
        <span className="live-pill">● LIVE</span>
        <span className="viewer-count">👁 2.4K</span>
      </div>

      <div className="broadcast-title">
        <h1>{match.tournament}</h1>
        <p>
          {match.round} · {match.courtName}
        </p>
      </div>

      {match.tieBreak && <div className="tie-break-banner">🔥 TIE BREAK</div>}

      <div className="broadcast-score-row">
        <div className="team-card team-card-a">
          <div>
            <strong>{match.playerA.name}</strong>
            <span>{match.playerA.flag}</span>
          </div>
        </div>

        <div className="main-score">
          <strong>{score}</strong>
          <span>Set {match.playerA.sets + match.playerB.sets + 1}</span>
        </div>

        <div className="team-card team-card-b">
          <div>
            <strong>{match.playerB.name}</strong>
            <span>{match.playerB.flag}</span>
          </div>
        </div>
      </div>

      <Scoreboard
        playerA={match.playerA}
        playerB={match.playerB}
        score={`${match.playerA.games} - ${match.playerB.games}`}
      />

      <CourtScene match={match} />

      <div className="broadcast-bottom-strip">
        <div>
          <span>Last Point</span>
          <strong>{match.events[0] || 'Waiting...'}</strong>
        </div>

        <div>
          <span>Match Time</span>
          <strong>{match.matchTime}</strong>
        </div>
      </div>

      <div className="social-rail">
        <div>
          ❤️<span>12.6K</span>
        </div>
        <div>
          💬<span>184</span>
        </div>
        <div>
          🔖<span>1,032</span>
        </div>
        <div>
          ↗️<span>389</span>
        </div>
      </div>
    </div>
  );
}
