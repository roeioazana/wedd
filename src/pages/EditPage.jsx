import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getInvitationById, listInvitations, saveInvitation } from "../services/invitationService";

const blockTypeOptions = ["hero", "ourStory", "text", "infoList", "cta"];

function normalizeBlocks(blocks) {
  return [...blocks]
    .sort((a, b) => a.order - b.order)
    .map((block, index) => ({ ...block, order: index + 1 }));
}

function createBlockTemplate(type, order) {
  const id = `${type}-${Date.now()}`;
  const base = { id, type, order, visible: true };

  if (type === "hero") {
    return {
      ...base,
      title: "New Couple",
      subtitle: "You are invited to celebrate with us",
      date: "Saturday, June 20, 2026",
      filmImages: []
    };
  }

  if (type === "ourStory") {
    return {
      ...base,
      heading: "Our Story",
      body: "Tell your story here."
    };
  }

  if (type === "text") {
    return {
      ...base,
      heading: "Section Heading",
      body: "Write content here."
    };
  }

  if (type === "infoList") {
    return {
      ...base,
      heading: "Event details",
      actions: ["Navigate to the venue", "Add to Calendar"],
      items: [{ label: "Time", value: "6:30 PM" }]
    };
  }

  return {
    ...base,
    label: "RSVP",
    href: "#"
  };
}

function SectionField({ label, children }) {
  return (
    <label className="edit-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function EditPage() {
  const [invitations, setInvitations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState(null);
  const [newBlockType, setNewBlockType] = useState("text");
  const [saveLabel, setSaveLabel] = useState("Save");

  useEffect(() => {
    const loadedInvitations = listInvitations();
    setInvitations(loadedInvitations);
    setSelectedId((prev) => prev || loadedInvitations[0]?.id || "");
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDraft(null);
      return;
    }

    setDraft(getInvitationById(selectedId));
    setSaveLabel("Save");
  }, [selectedId]);

  const orderedBlocks = useMemo(() => {
    return draft?.blocks ? normalizeBlocks(draft.blocks) : [];
  }, [draft]);

  function updateInvitationField(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateBlock(blockId, updater) {
    setDraft((prev) => {
      const nextBlocks = prev.blocks.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        return updater(block);
      });

      return { ...prev, blocks: nextBlocks };
    });
  }

  function removeBlock(blockId) {
    setDraft((prev) => ({
      ...prev,
      blocks: normalizeBlocks(prev.blocks.filter((block) => block.id !== blockId))
    }));
  }

  function moveBlock(blockId, direction) {
    setDraft((prev) => {
      const sorted = normalizeBlocks(prev.blocks);
      const index = sorted.findIndex((block) => block.id === blockId);

      if (index < 0) {
        return prev;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= sorted.length) {
        return prev;
      }

      const temp = sorted[index];
      sorted[index] = sorted[targetIndex];
      sorted[targetIndex] = temp;

      return { ...prev, blocks: normalizeBlocks(sorted) };
    });
  }

  function addBlock() {
    setDraft((prev) => {
      const nextBlock = createBlockTemplate(newBlockType, prev.blocks.length + 1);
      return { ...prev, blocks: normalizeBlocks([...prev.blocks, nextBlock]) };
    });
  }

  function onSave() {
    if (!draft) {
      return;
    }

    saveInvitation({ ...draft, blocks: normalizeBlocks(draft.blocks) });
    setInvitations(listInvitations());
    setSaveLabel("Saved");
  }

  return (
    <main className="edit-page">
      <aside className="edit-sidebar">
        <h1>Invitation Editor</h1>
        <p>Pick invitation and edit blocks.</p>
        <SectionField label="Invitation ID">
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {invitations.map((invitation) => (
              <option key={invitation.id} value={invitation.id}>
                {invitation.id}
              </option>
            ))}
          </select>
        </SectionField>
        <Link className="preview-link" to={`/w/${selectedId}`} target="_blank" rel="noreferrer">
          Open Preview
        </Link>
      </aside>

      <section className="edit-content">
        {!draft ? (
          <p>Select an invitation to start editing.</p>
        ) : (
          <>
            <section className="edit-card">
              <h2>Invitation</h2>
              <div className="edit-grid">
                <SectionField label="ID">
                  <input
                    value={draft.id}
                    onChange={(event) => updateInvitationField("id", event.target.value)}
                  />
                </SectionField>
                <SectionField label="Published">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.published)}
                    onChange={(event) => updateInvitationField("published", event.target.checked)}
                  />
                </SectionField>
              </div>
            </section>

            <section className="edit-card">
              <h2>Blocks</h2>
              <div className="add-block-row">
                <select value={newBlockType} onChange={(event) => setNewBlockType(event.target.value)}>
                  {blockTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={addBlock}>
                  Add Block
                </button>
              </div>

              <div className="block-list">
                {orderedBlocks.map((block, index) => (
                  <article key={block.id} className="block-editor">
                    <header>
                      <strong>
                        {index + 1}. {block.type}
                      </strong>
                      <div className="block-actions">
                        <button type="button" onClick={() => moveBlock(block.id, "up")}>
                          Up
                        </button>
                        <button type="button" onClick={() => moveBlock(block.id, "down")}>
                          Down
                        </button>
                        <button type="button" onClick={() => removeBlock(block.id)}>
                          Remove
                        </button>
                      </div>
                    </header>

                    <div className="edit-grid">
                      <SectionField label="Block ID">
                        <input
                          value={block.id}
                          onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, id: event.target.value }))}
                        />
                      </SectionField>
                      <SectionField label="Order">
                        <input
                          type="number"
                          value={block.order}
                          onChange={(event) =>
                            updateBlock(block.id, (prev) => ({
                              ...prev,
                              order: Number(event.target.value) || prev.order
                            }))
                          }
                        />
                      </SectionField>
                      <SectionField label="Visible">
                        <input
                          type="checkbox"
                          checked={Boolean(block.visible)}
                          onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, visible: event.target.checked }))}
                        />
                      </SectionField>
                    </div>

                    {block.type === "hero" ? (
                      <div className="edit-stack">
                        <SectionField label="Date">
                          <input
                            value={block.date || ""}
                            onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, date: event.target.value }))}
                          />
                        </SectionField>
                        <SectionField label="Title">
                          <input
                            value={block.title || ""}
                            onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, title: event.target.value }))}
                          />
                        </SectionField>
                        <SectionField label="Subtitle">
                          <textarea
                            value={block.subtitle || ""}
                            onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, subtitle: event.target.value }))}
                          />
                        </SectionField>
                        <div className="sub-list">
                          <p>Film Images</p>
                          {(block.filmImages || []).map((image, imageIndex) => (
                            <div key={`${block.id}-image-${imageIndex}`} className="sub-row">
                              <input
                                placeholder="Image src"
                                value={image.src || ""}
                                onChange={(event) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    filmImages: prev.filmImages.map((item, idx) =>
                                      idx === imageIndex ? { ...item, src: event.target.value } : item
                                    )
                                  }))
                                }
                              />
                              <input
                                placeholder="Alt text"
                                value={image.alt || ""}
                                onChange={(event) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    filmImages: prev.filmImages.map((item, idx) =>
                                      idx === imageIndex ? { ...item, alt: event.target.value } : item
                                    )
                                  }))
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    filmImages: prev.filmImages.filter((_, idx) => idx !== imageIndex)
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              updateBlock(block.id, (prev) => ({
                                ...prev,
                                filmImages: [...(prev.filmImages || []), { src: "", alt: "" }]
                              }))
                            }
                          >
                            Add Image
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {block.type === "ourStory" || block.type === "text" ? (
                      <div className="edit-stack">
                        <SectionField label="Heading">
                          <input
                            value={block.heading || ""}
                            onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, heading: event.target.value }))}
                          />
                        </SectionField>
                        <SectionField label="Body">
                          <textarea
                            value={block.body || ""}
                            onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, body: event.target.value }))}
                          />
                        </SectionField>
                      </div>
                    ) : null}

                    {block.type === "infoList" ? (
                      <div className="edit-stack">
                        <SectionField label="Heading">
                          <input
                            value={block.heading || ""}
                            onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, heading: event.target.value }))}
                          />
                        </SectionField>
                        <div className="sub-list">
                          <p>Details</p>
                          {(block.items || []).map((item, itemIndex) => (
                            <div key={`${block.id}-item-${itemIndex}`} className="sub-row">
                              <input
                                placeholder="Label"
                                value={item.label || ""}
                                onChange={(event) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    items: prev.items.map((current, idx) =>
                                      idx === itemIndex ? { ...current, label: event.target.value } : current
                                    )
                                  }))
                                }
                              />
                              <input
                                placeholder="Value"
                                value={item.value || ""}
                                onChange={(event) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    items: prev.items.map((current, idx) =>
                                      idx === itemIndex ? { ...current, value: event.target.value } : current
                                    )
                                  }))
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    items: prev.items.filter((_, idx) => idx !== itemIndex)
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              updateBlock(block.id, (prev) => ({
                                ...prev,
                                items: [...(prev.items || []), { label: "", value: "" }]
                              }))
                            }
                          >
                            Add Detail Row
                          </button>
                        </div>
                        <div className="sub-list">
                          <p>Buttons</p>
                          {(block.actions || []).map((actionLabel, actionIndex) => (
                            <div key={`${block.id}-action-${actionIndex}`} className="sub-row">
                              <input
                                value={actionLabel}
                                onChange={(event) =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    actions: prev.actions.map((value, idx) =>
                                      idx === actionIndex ? event.target.value : value
                                    )
                                  }))
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateBlock(block.id, (prev) => ({
                                    ...prev,
                                    actions: prev.actions.filter((_, idx) => idx !== actionIndex)
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              updateBlock(block.id, (prev) => ({
                                ...prev,
                                actions: [...(prev.actions || []), "New action"]
                              }))
                            }
                          >
                            Add Button
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {block.type === "cta" ? (
                      <div className="edit-stack">
                        <SectionField label="Button Label">
                          <input
                            value={block.label || ""}
                            onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, label: event.target.value }))}
                          />
                        </SectionField>
                        <SectionField label="URL">
                          <input
                            value={block.href || ""}
                            onChange={(event) => updateBlock(block.id, (prev) => ({ ...prev, href: event.target.value }))}
                          />
                        </SectionField>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <div className="save-row">
              <button type="button" onClick={onSave}>
                {saveLabel}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
