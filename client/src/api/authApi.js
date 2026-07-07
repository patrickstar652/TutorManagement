import apiClient, { unwrapData } from "./axiosClient";

export const login = async ({ account, password }) => {
  const response = await apiClient.post("/login", { account, password });
  return unwrapData(response);
};
