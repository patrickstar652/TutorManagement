import apiClient, { unwrapData } from "./axiosClient";

export const listPayments = async (scheduleId) => {
  const response = await apiClient.get(`/classes/${scheduleId}/payments`);
  return unwrapData(response);
};

export const updatePayment = async ({ scheduleId, student, amount, status }) => {
  const response = await apiClient.patch(
    `/classes/${scheduleId}/payments`,
    {
      scheduleId,
      student,
      amount,
      status,
    }
  );
  return unwrapData(response);
};
