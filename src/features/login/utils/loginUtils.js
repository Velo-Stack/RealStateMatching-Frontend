import { LOGIN_TEXT } from "../constants/loginConstants";

export const getLoginErrorMessage = (error) =>
  error?.response?.data?.message || LOGIN_TEXT.fallbackError;
