import { useEffect, useRef } from "react";
import HeroBlock from "./blocks/HeroBlock";
import OurStoryBlock from "./blocks/OurStoryBlock";
import TextBlock from "./blocks/TextBlock";
import InfoListBlock from "./blocks/InfoListBlock";
import CtaBlock from "./blocks/CtaBlock";

const blockComponents = {
  hero: HeroBlock,
  ourStory: OurStoryBlock,
  text: TextBlock,
  infoList: InfoListBlock,
  cta: CtaBlock
};

export default function InvitationRenderer({ invitation }) {
  const blockRefs = useRef([]);

  const blocks = [...invitation.blocks]
    .filter((block) => block.visible)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    const nodes = blockRefs.current.filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.6 }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [blocks.length]);

  return (
    <article className="invitation-page">
      {blocks.map((block, index) => {
        const BlockComponent = blockComponents[block.type];

        if (!BlockComponent) {
          return null;
        }

        return (
          <div
            key={block.id}
            className={`invitation-block-wrap ${index === blocks.length - 1 ? "is-last" : ""}`}
            ref={(node) => {
              blockRefs.current[index] = node;
            }}
            data-index={String(index + 1).padStart(2, "0")}
          >
            <BlockComponent block={block} />
          </div>
        );
      })}
    </article>
  );
}
