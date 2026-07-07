import { listClasses } from "../api/classApi";
import { useAsyncData } from "./useAsyncData";

export const useClasses = () => {
  const state = useAsyncData(listClasses, { initialData: [] });

  return {
    ...state,
    classes: state.data || [],
  };
};
