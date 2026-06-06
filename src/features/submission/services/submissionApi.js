import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiBaseUrl";

export const submitPublicOffer = async (token, payload) => {
  const { data } = await axios.post(
    `${getApiBaseUrl()}/public/submissions/offer?token=${token}`,
    payload
  );
  return data;
};

export const submitPublicRequest = async (token, payload) => {
  const { data } = await axios.post(
    `${getApiBaseUrl()}/public/submissions/request?token=${token}`,
    payload
  );
  return data;
};
