const invitationModules = import.meta.glob("../data/invitations/*.json", { eager: true });

export function getInvitationById(id) {
  const filePath = `../data/invitations/${id}.json`;
  const module = invitationModules[filePath];

  if (!module) {
    return null;
  }

  return module.default || null;
}
