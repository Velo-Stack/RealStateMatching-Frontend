export const getTopBrokersFromData = ({ offers = [], matches = [], users = [] }) => {
  const usersById = new Map(users.map((user) => [user.id, user]));
  const brokersMap = new Map();

  const ensureBroker = (brokerId, fallbackName) => {
    if (!brokerId) return null;
    if (!brokersMap.has(brokerId)) {
      const user = usersById.get(brokerId);
      brokersMap.set(brokerId, {
        brokerId,
        name: user?.name || fallbackName || `وسيط #${brokerId}`,
        contractsCount: 0,
        closedDealsCount: 0,
        score: 0,
      });
    }
    return brokersMap.get(brokerId);
  };

  offers.forEach((offer) => {
    if (offer?.contractType !== "WITH_MEDIATION_CONTRACT") return;
    const brokerId = offer.createdById || offer.createdBy?.id;
    const broker = ensureBroker(brokerId, offer.createdBy?.name);
    if (broker) broker.contractsCount += 1;
  });

  matches.forEach((match) => {
    if (match?.status !== "CLOSED") return;
    const brokerId = match.offer?.createdById || match.offer?.createdBy?.id;
    const broker = ensureBroker(brokerId, match.offer?.createdBy?.name);
    if (broker) broker.closedDealsCount += 1;
  });

  const ranked = Array.from(brokersMap.values())
    .map((item) => ({
      ...item,
      score: (item.contractsCount * 1) + (item.closedDealsCount * 3),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return ranked;
};
