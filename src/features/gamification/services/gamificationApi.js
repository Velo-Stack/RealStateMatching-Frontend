import api from "../../../utils/api";

export const fetchMyPoints = async ({ limit = 50, offset = 0 } = {}) => {
  const { data } = await api.get("/brokers/me/points", { params: { limit, offset } });
  return data;
};

export const fetchMyTier = async () => {
  const { data } = await api.get("/brokers/me/tier");
  return data;
};

export const fetchLeaderboard = async (limit = 10) => {
  const { data } = await api.get("/brokers/leaderboard", { params: { limit } });
  return data;
};

export const fetchRewards = async () => {
  const { data } = await api.get("/brokers/rewards");
  return data;
};

export const redeemRewardApi = async (rewardId) => {
  const { data } = await api.post(`/brokers/rewards/${rewardId}/redeem`);
  return data;
};

export const adjustBrokerPointsApi = async (userId, payload) => {
  const { data } = await api.post(`/brokers/admin/brokers/${userId}/points`, payload);
  return data;
};

export const fetchRedemptions = async (status) => {
  const { data } = await api.get("/brokers/admin/redemptions", {
    params: status ? { status } : undefined,
  });
  return data;
};

export const updateRedemptionStatusApi = async (id, status) => {
  const { data } = await api.patch(`/brokers/admin/redemptions/${id}`, { status });
  return data;
};
