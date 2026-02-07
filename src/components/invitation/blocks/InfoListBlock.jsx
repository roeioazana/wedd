export default function InfoListBlock({ block }) {
  const actionButtons = Array.isArray(block.actions) && block.actions.length > 0
    ? block.actions
    : ["Navigate to the venue", "Add to Calendar"];

  return (
    <section className="invitation-block block-info-list">
      <h2 className="reveal-text reveal-1">{block.heading}</h2>
      <ul>
        {block.items.map((item, index) => (
          <li key={item.label}>
            <span
              className="reveal-text"
              style={{ animationDelay: `${520 + index * 220}ms` }}
            >
              {item.label}
            </span>
            <strong
              className="reveal-text"
              style={{ animationDelay: `${660 + index * 220}ms` }}
            >
              {item.value}
            </strong>
          </li>
        ))}
      </ul>
      <div className="event-actions">
        {actionButtons.map((label, index) => (
          <button
            key={label}
            type="button"
            className="event-action-btn reveal-text"
            style={{ animationDelay: `${1100 + index * 240}ms` }}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
