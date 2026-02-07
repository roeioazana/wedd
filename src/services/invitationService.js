const invitationModules = import.meta.glob("../data/invitations/*.json", { eager: true });
const STORAGE_KEY = "wedd-invitation-overrides";

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function getBaseInvitationMap() {
  const map = {};

  Object.values(invitationModules).forEach((module) => {
    const invitation = module.default;

    if (invitation?.id) {
      map[invitation.id] = invitation;
    }
  });

  return map;
}

function readOverrides() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function listInvitations() {
  const baseMap = getBaseInvitationMap();
  const overrides = readOverrides();
  const merged = { ...baseMap, ...overrides };

  return Object.values(merged)
    .filter((invitation) => invitation?.id)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((invitation) => clone(invitation));
}

export function getInvitationById(id) {
  const overrides = readOverrides();

  if (overrides[id]) {
    return clone(overrides[id]);
  }

  const baseMap = getBaseInvitationMap();
  const invitation = baseMap[id];

  if (!invitation) {
    return null;
  }

  return clone(invitation);
}

export function saveInvitation(invitation) {
  if (!invitation?.id) {
    return;
  }

  const overrides = readOverrides();
  overrides[invitation.id] = clone(invitation);
  writeOverrides(overrides);
}
