import { getPlayerColor } from '../utils/playerColors';
import Scoreboard from './Scoreboard';

export default function BroadcastView({ match, score }) {
  return (
    <div className="broadcast-view">
      <div className="live">● LIVE</div>

      <h1>MatchFlow</h1>
      <p className="tournament">{match.tournament}</p>

      {match.tieBreak && <div className="tie-break-banner">🔥 TIE BREAK</div>}

      <div className="match-meta">
        <span>{match.round}</span>
        <span>{match.courtName}</span>
        <span>{match.matchTime}</span>
      </div>

      <Scoreboard
        playerA={match.playerA}
        playerB={match.playerB}
        score={score}
      />

      <div
        className={`court ${match.broadcastEvent
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

        {match.broadcastEvent && (
          <div className="event-badge">{match.broadcastEvent}</div>
        )}
      </div>
    </div>
  );
}
