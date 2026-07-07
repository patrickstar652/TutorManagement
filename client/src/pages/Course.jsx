import AddCourse from "../component/AddCourse";
import Navbar from "../component/Navbar";
import ShowCourse from "../component/ShowCourse";
import { useState } from "react";
import { getApiErrorMessage } from "../api/axiosClient";
import { useCourses } from "../hooks/useCourses";

function Course() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const {
    addCourse,
    courseTable,
    error,
    loading,
    removeCourse,
    timeSlots,
  } = useCourses();

  const handleCreateCourse = async (course) => {
    await addCourse(course);
    setIsAddOpen(false);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await removeCourse(courseId);
    } catch (error) {
      alert(getApiErrorMessage(error, "刪除課程失敗，請稍後再試"));
    }
  };

  return (
    <div className="tm-page">
      <Navbar/>
      <div className="tm-shell py-10">
        <div className="relative mb-8 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="tm-section-kicker mb-3">每週課表</span>
            <h1 className="tm-section-title">
              課程時間表
            </h1>
            <div className="tm-title-underline"></div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="tm-primary-btn static mt-2 md:absolute md:right-0 md:top-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            加入課表
          </button>
        </div>
      </div>
      <ShowCourse
        courseTable={courseTable}
        error={error}
        loading={loading}
        onDelete={handleDeleteCourse}
        timeSlots={timeSlots}
      />
      <AddCourse
        onClose={() => setIsAddOpen(false)}
        onCreate={handleCreateCourse}
        open={isAddOpen}
      />
    </div>
  );
}
export default Course;
