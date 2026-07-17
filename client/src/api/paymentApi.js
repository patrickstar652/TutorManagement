import apiClient, { unwrapData } from "./axiosClient";

export const listPayments = async (scheduleId, periodId = null) => {
  const response = await apiClient.get(`/classes/${scheduleId}/payments`, {
    params: periodId ? { periodId } : undefined,
  });
  return unwrapData(response);
};

export const createBillingPeriod = async ({
  scheduleId,
  periodStart,
  periodEnd,
  lessonCount,
  unitPrice,
}) => {
  const response = await apiClient.post(
    `/classes/${scheduleId}/billing-periods`,
    { lessonCount, periodEnd, periodStart, unitPrice }
  );
  return unwrapData(response);
};

export const updateBillingPeriod = async ({
  scheduleId,
  periodId,
  periodStart,
  periodEnd,
  lessonCount,
  unitPrice,
}) => {
  const response = await apiClient.patch(
    `/classes/${scheduleId}/billing-periods/${periodId}`,
    { lessonCount, periodEnd, periodStart, unitPrice }
  );
  return unwrapData(response);
};

export const updatePaymentStatus = async ({
  scheduleId,
  paymentId,
  status,
}) => {
  const response = await apiClient.patch(
    `/classes/${scheduleId}/payments/${paymentId}`,
    { status }
  );
  return unwrapData(response);
};
