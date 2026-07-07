import apiClient, { unwrapData } from "./axiosClient";

export const listClasses = async () => {
  const response = await apiClient.get("/classes");
  return unwrapData(response);
};

export const listSeats = async (scheduleId) => {
  const response = await apiClient.get(`/classes/${scheduleId}/seats`);
  return unwrapData(response);
};

export const updateSeat = async ({ scheduleId, seatId, name }) => {
  const response = await apiClient.patch(
    `/classes/${scheduleId}/seats/${seatId}`,
    { name }
  );
  return unwrapData(response);
};
