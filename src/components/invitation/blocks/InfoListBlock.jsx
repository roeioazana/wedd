export default function InfoListBlock({ block }) {
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
    </section>
  );
}
