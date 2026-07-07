import apiClient, { unwrapData } from "./axiosClient";

export const listReminders = async (scheduleId) => {
  const params = scheduleId ? { scheduleId } : {};
  const response = await apiClient.get("/reminder", { params });
  return unwrapData(response);
};

export const createReminder = async (reminder) => {
  const response = await apiClient.post("/reminder", reminder);
  return unwrapData(response);
};

export const deleteReminder = async (reminderId) => {
  const response = await apiClient.delete(`/reminder/${reminderId}`);
  return unwrapData(response);
};
