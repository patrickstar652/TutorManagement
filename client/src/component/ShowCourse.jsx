import CourseTable from "./CourseTable";

function ShowCourse({ courseTable, error, loading, onDelete, timeSlots }) {
  if (loading) {
    return (
      <div className="tm-shell pb-12">
        <div className="tm-panel p-8 text-center font-semibold text-slate-500">
          載入課表中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tm-shell pb-12">
        <div className="tm-panel p-8 text-center font-semibold text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="tm-shell pb-12">
      <CourseTable
        courseTable={courseTable}
        onDelete={onDelete}
        timeSlots={timeSlots}
      />
    </div>
  );
}
export default ShowCourse;
