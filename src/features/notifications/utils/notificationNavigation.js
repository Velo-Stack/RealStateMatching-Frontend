/**
 * Resolve deep-link destination for a notification.
 * Supports unified meta { entity, entityId } and legacy fields.
 */
export const resolveNotificationPath = (notification) => {
  const { type, matchId, conversationId, meta } = notification;

  if (type === "MATCH" && matchId) {
    return `/app/matches?matchId=${matchId}`;
  }

  if (type === "MESSAGE" && conversationId) {
    return `/app/chat?conversationId=${conversationId}`;
  }

  if (type === "SYSTEM" && meta) {
    const entity = meta.entity;
    const entityId =
      meta.entityId
      ?? meta.registrationId
      ?? meta.requestId
      ?? meta.offerId
      ?? meta.joinApplicationId;

    if (entity === "joinApplication" || meta.joinApplicationId) {
      const id = entityId ?? meta.joinApplicationId;
      return id ? `/app/join-applications?highlight=${id}` : null;
    }

    if (entity === "registration" || meta.registrationId) {
      const id = entityId ?? meta.registrationId;
      return id ? `/app/registrations?highlight=${id}` : null;
    }

    if (entity === "request" || meta.requestId) {
      const id = entityId ?? meta.requestId;
      return id ? `/app/requests?requestId=${id}` : null;
    }

    if (entity === "offer" || meta.offerId) {
      const id = entityId ?? meta.offerId;
      return id ? `/app/offers?offerId=${id}` : null;
    }
  }

  return null;
};
