function resolveAssetSrc(src = "") {
  if (!src) {
    return src;
  }

  if (/^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  const base = import.meta.env.BASE_URL || "/";

  if (!src.startsWith("/")) {
    return `${base}${src}`;
  }

  return `${base.replace(/\/$/, "")}${src}`;
}

export default function HeroBlock({ block }) {
  const filmImages = Array.isArray(block.filmImages) ? block.filmImages : [];
  const loopImages = [...filmImages, ...filmImages];

  return (
    <section className="invitation-block block-hero">
      <p className="hero-date reveal-text reveal-1">{block.date}</p>
      <h1 className="reveal-text reveal-2">{block.title}</h1>
      <p className="reveal-text reveal-3">{block.subtitle}</p>
      {filmImages.length > 0 ? (
        <div className="hero-film reveal-text reveal-5" aria-hidden="true">
          <div className="hero-film-track">
            {loopImages.map((image, index) => (
              <figure className="hero-film-frame" key={`${image.src}-${index}`}>
                <img src={resolveAssetSrc(image.src)} alt={image.alt || "Couple photo"} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
