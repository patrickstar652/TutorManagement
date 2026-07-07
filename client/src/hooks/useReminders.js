import { useCallback } from "react";
import {
  createReminder,
  deleteReminder,
  listReminders,
} from "../api/reminderApi";
import { useAsyncData } from "./useAsyncData";

export const useReminders = (scheduleId) => {
  const loadReminders = useCallback(
    () => listReminders(scheduleId),
    [scheduleId]
  );
  const state = useAsyncData(loadReminders, {
    initialData: [],
  });

  const addReminder = useCallback(
    async (reminder) => {
      await createReminder(reminder);
      await state.refresh();
    },
    [state]
  );

  const removeReminder = useCallback(
    async (reminderId) => {
      await deleteReminder(reminderId);
      await state.refresh();
    },
    [state]
  );

  return {
    ...state,
    addReminder,
    reminders: state.data || [],
    removeReminder,
  };
};
