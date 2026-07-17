import { useCallback, useEffect, useRef, useState } from "react";
import {
  createBillingPeriod,
  listPayments,
  updateBillingPeriod,
  updatePaymentStatus,
} from "../api/paymentApi";
import { useAsyncData } from "./useAsyncData";

const EMPTY_OVERVIEW = {
  current_period: null,
  payments: [],
  periods: [],
  summary: {
    paid_count: 0,
    total_collected: 0,
    total_due: 0,
    total_outstanding: 0,
    total_students: 0,
    unpaid_count: 0,
  },
};

export const usePayments = (scheduleId) => {
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);
  const [savingPeriod, setSavingPeriod] = useState(false);
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
  const paymentMutationIdRef = useRef(0);
  const periodMutationIdRef = useRef(0);
  const scheduleIdRef = useRef(scheduleId);
  const viewVersionRef = useRef(0);
  scheduleIdRef.current = scheduleId;

  useEffect(() => {
    viewVersionRef.current += 1;
    paymentMutationIdRef.current += 1;
    periodMutationIdRef.current += 1;
    setSelectedPeriodId(null);
    setSavingPeriod(false);
    setUpdatingPaymentId(null);
  }, [scheduleId]);

  const loadOverview = useCallback(
    () => listPayments(scheduleId, selectedPeriodId),
    [scheduleId, selectedPeriodId]
  );
  const { data, error, loading, refresh, setData } = useAsyncData(loadOverview, {
    enabled: Boolean(scheduleId),
    initialData: EMPTY_OVERVIEW,
  });

  const selectPeriod = useCallback((periodId) => {
    viewVersionRef.current += 1;
    setSelectedPeriodId(Number(periodId));
  }, []);

  const createPeriod = useCallback(
    async (period) => {
      const requestScheduleId = scheduleId;
      const requestViewVersion = viewVersionRef.current;
      const mutationId = periodMutationIdRef.current + 1;
      periodMutationIdRef.current = mutationId;
      setSavingPeriod(true);
      try {
        const overview = await createBillingPeriod({ scheduleId, ...period });
        if (
          scheduleIdRef.current === requestScheduleId &&
          viewVersionRef.current === requestViewVersion &&
          periodMutationIdRef.current === mutationId
        ) {
          setData(overview);
          viewVersionRef.current += 1;
          setSelectedPeriodId(overview.current_period?.id || null);
        }
        return overview;
      } finally {
        if (periodMutationIdRef.current === mutationId) {
          setSavingPeriod(false);
        }
      }
    },
    [scheduleId, setData]
  );

  const editPeriod = useCallback(
    async (period) => {
      const requestScheduleId = scheduleId;
      const requestViewVersion = viewVersionRef.current;
      const mutationId = periodMutationIdRef.current + 1;
      periodMutationIdRef.current = mutationId;
      setSavingPeriod(true);
      try {
        const overview = await updateBillingPeriod({ scheduleId, ...period });
        if (
          scheduleIdRef.current === requestScheduleId &&
          viewVersionRef.current === requestViewVersion &&
          periodMutationIdRef.current === mutationId
        ) {
          setData(overview);
        }
        return overview;
      } finally {
        if (periodMutationIdRef.current === mutationId) {
          setSavingPeriod(false);
        }
      }
    },
    [scheduleId, setData]
  );

  const setPaymentStatus = useCallback(
    async ({ paymentId, status }) => {
      const requestScheduleId = scheduleId;
      const requestViewVersion = viewVersionRef.current;
      const mutationId = paymentMutationIdRef.current + 1;
      paymentMutationIdRef.current = mutationId;
      setUpdatingPaymentId(paymentId);
      try {
        const overview = await updatePaymentStatus({
          paymentId,
          scheduleId,
          status,
        });
        if (
          scheduleIdRef.current === requestScheduleId &&
          viewVersionRef.current === requestViewVersion &&
          paymentMutationIdRef.current === mutationId
        ) {
          setData(overview);
        }
        return overview;
      } finally {
        if (paymentMutationIdRef.current === mutationId) {
          setUpdatingPaymentId(null);
        }
      }
    },
    [scheduleId, setData]
  );

  const overview = data || EMPTY_OVERVIEW;

  return {
    createPeriod,
    currentPeriod: overview.current_period,
    data,
    editPeriod,
    error,
    loading,
    payments: overview.payments || [],
    periods: overview.periods || [],
    refresh,
    savingPeriod,
    selectedPeriodId,
    selectPeriod,
    setPaymentStatus,
    summary: overview.summary || EMPTY_OVERVIEW.summary,
    updatingPaymentId,
  };
};
