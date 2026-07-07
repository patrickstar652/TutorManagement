import { useCallback } from "react";
import { listPayments, updatePayment } from "../api/paymentApi";
import { useAsyncData } from "./useAsyncData";

export const usePayments = (scheduleId) => {
  const loadPayments = useCallback(() => listPayments(scheduleId), [scheduleId]);
  const state = useAsyncData(loadPayments, {
    enabled: Boolean(scheduleId),
    initialData: [],
  });

  const savePayment = useCallback(
    async (payment) => {
      await updatePayment({ scheduleId, ...payment });
      await state.refresh();
    },
    [scheduleId, state]
  );

  return {
    ...state,
    payments: state.data || [],
    savePayment,
  };
};
