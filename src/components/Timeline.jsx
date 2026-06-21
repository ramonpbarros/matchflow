export default function Timeline({ events }) {
  return (
    <div className="timeline">
      <h3>📖 Match Story</h3>

      {events.length === 0 ? (
        <p className="timeline-empty">No events yet</p>
      ) : (
        events.map((item, index) => (
          <div key={index} className="timeline-item">
            {item}
          </div>
        ))
      )}
    </div>
  );
}
