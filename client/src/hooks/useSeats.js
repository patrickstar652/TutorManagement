import { useCallback, useMemo } from "react";
import { listSeats, updateSeat } from "../api/classApi";
import { useAsyncData } from "./useAsyncData";

const toSeatMap = (seats) => {
  return seats.reduce((acc, seat) => {
    acc[seat.seat_id] = seat.name;
    return acc;
  }, {});
};

export const useSeats = (scheduleId) => {
  const loadSeats = useCallback(() => listSeats(scheduleId), [scheduleId]);
  const state = useAsyncData(loadSeats, {
    enabled: Boolean(scheduleId),
    initialData: [],
  });

  const seatMap = useMemo(() => toSeatMap(state.data || []), [state.data]);

  const saveSeat = useCallback(
    async ({ seatId, name }) => {
      await updateSeat({ scheduleId, seatId, name });
      await state.refresh();
    },
    [scheduleId, state]
  );

  return {
    ...state,
    saveSeat,
    seatMap,
    seats: state.data || [],
  };
};
