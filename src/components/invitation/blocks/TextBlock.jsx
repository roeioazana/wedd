export default function TextBlock({ block }) {
  return (
    <section className="invitation-block block-text">
      <h2 className="reveal-text reveal-1">{block.heading}</h2>
      <p className="reveal-text reveal-2">{block.body}</p>
    </section>
  );
}
