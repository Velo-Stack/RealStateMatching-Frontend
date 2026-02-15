import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Public API - لا يحتاج authentication
export const submitPublicOffer = async (token, payload) => {
    const { data } = await axios.post(
        `${API_URL}/public/submissions/offer?token=${token}`,
        payload
    );
    return data;
};

export const submitPublicRequest = async (token, payload) => {
    const { data } = await axios.post(
        `${API_URL}/public/submissions/request?token=${token}`,
        payload
    );
    return data;
};
