import { useMemo } from "react";
import { useParams } from "react-router-dom";
import InvitationRenderer from "../components/invitation/InvitationRenderer";
import { getInvitationById } from "../services/invitationService";

export default function InvitationPage() {
  const { id } = useParams();

  const invitation = useMemo(() => getInvitationById(id), [id]);

  if (!invitation) {
    return (
      <main className="invitation-shell">
        <section className="invitation-message-card">
          <h1>Invitation not found</h1>
          <p>No invitation exists for id: {id}</p>
        </section>
      </main>
    );
  }

  if (!invitation.published) {
    return (
      <main className="invitation-shell">
        <section className="invitation-message-card">
          <h1>Invitation not published</h1>
          <p>This invitation is currently hidden.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="invitation-shell">
      <section className="desktop-notice">
        <h1>Mobile only page</h1>
        <p>Open this invitation on a mobile device for the full experience.</p>
      </section>
      <section className="mobile-invitation">
        <InvitationRenderer invitation={invitation} />
      </section>
    </main>
  );
}
