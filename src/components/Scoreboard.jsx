export default function Scoreboard({ playerA, playerB, score }) {
  return (
    <div className="scoreboard">
      <span>
        {playerA.name} {playerA.flag}
        <small>
          Sets {playerA.sets} | Games {playerA.games}
        </small>
      </span>

      <strong>{score}</strong>

      <span>
        {playerB.name} {playerB.flag}
        <small>
          Sets {playerB.sets} | Games {playerB.games}
        </small>
      </span>
    </div>
  );
}
