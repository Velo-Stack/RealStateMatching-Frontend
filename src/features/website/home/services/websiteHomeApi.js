import api from "../../../../utils/api";

export const fetchWebsiteHome = async () => {
  const { data } = await api.get("/website/home");
  return data;
};
