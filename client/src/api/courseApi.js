import apiClient, { unwrapData } from "./axiosClient";

export const listCourses = async () => {
  const response = await apiClient.get("/courses");
  return unwrapData(response);
};

export const createCourse = async (course) => {
  const response = await apiClient.post("/courses", course);
  return unwrapData(response);
};

export const deleteCourse = async (scheduleId) => {
  const response = await apiClient.delete(`/courses/${scheduleId}`);
  return unwrapData(response);
};
