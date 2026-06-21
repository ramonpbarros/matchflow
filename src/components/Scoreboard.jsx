export default function Scoreboard({ playerA, playerB, score }) {
  return (
    <div className="scoreboard">
      <span>
        {playerA.name} {playerA.flag}
        <small>
          {playerA.sets === 1 ? 'Set' : 'Sets'} {playerA.sets}
          {' | '}
          {playerA.games === 1 ? 'Game' : 'Games'} {playerA.games}
        </small>
      </span>

      <strong>{score}</strong>

      <span>
        {playerB.name} {playerB.flag}
        <small>
          {playerB.sets === 1 ? 'Set' : 'Sets'} {playerB.sets}
          {' | '}
          {playerB.games === 1 ? 'Game' : 'Games'} {playerB.games}
        </small>
      </span>
    </div>
  );
}
