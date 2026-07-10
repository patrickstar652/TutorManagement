import { useCallback } from "react";
import { listPayments, updatePayment } from "../api/paymentApi";
import { useAsyncData } from "./useAsyncData";

//從api拿function，並且把它包裝成hook，方便在component中使用

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
