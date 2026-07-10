import apiClient, { unwrapData } from "./axiosClient";

// 把api request的function寫死在這裡，方便在其他地方import使用
// 從axiosClient拿到apiClient、jwt，並且使用unwrapData來取得真正的response資料
// 每個api請求都須透過axios來送jwt驗證、拿到回傳的資料

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
