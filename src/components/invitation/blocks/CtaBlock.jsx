export default function CtaBlock({ block }) {
  return (
    <section className="invitation-block block-cta">
      <p className="cta-kicker reveal-text reveal-1">Final Step</p>
      <a className="reveal-text reveal-2" href={block.href} target="_blank" rel="noreferrer">
        {block.label}
      </a>
    </section>
  );
}
