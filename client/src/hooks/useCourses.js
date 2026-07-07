import { useCallback, useMemo } from "react";
import {
  createCourse,
  deleteCourse,
  listCourses,
} from "../api/courseApi";
import { useAsyncData } from "./useAsyncData";

const buildCourseTable = (courses) => {
  const timeSlots = Array.from(
    new Set(
      courses.map((item) => {
        const start = item.start_time.slice(0, 5);
        const end = item.end_time.slice(0, 5);
        return `${start}~${end}`;
      })
    )
  ).sort();

  const courseTable = {};
  timeSlots.forEach((slot) => {
    courseTable[slot] = {};
    for (let weekday = 1; weekday <= 7; weekday += 1) {
      courseTable[slot][weekday] = "";
    }
  });

  courses.forEach((item) => {
    const slot = `${item.start_time.slice(0, 5)}~${item.end_time.slice(0, 5)}`;
    if (courseTable[slot]) {
      courseTable[slot][item.weekday] = {
        courseId: item.id,
        courseName: item.course_name,
      };
    }
  });

  return { courseTable, timeSlots };
};

export const useCourses = () => {
  const state = useAsyncData(listCourses, { initialData: [] });
  const courses = useMemo(() => state.data || [], [state.data]);

  const table = useMemo(() => buildCourseTable(courses), [courses]);

  const addCourse = useCallback(
    async (course) => {
      await createCourse(course);
      await state.refresh();
    },
    [state]
  );

  const removeCourse = useCallback(
    async (scheduleId) => {
      await deleteCourse(scheduleId);
      await state.refresh();
    },
    [state]
  );

  return {
    ...state,
    addCourse,
    courseTable: table.courseTable,
    courses,
    removeCourse,
    timeSlots: table.timeSlots,
  };
};
