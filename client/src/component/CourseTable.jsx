import { useEffect, useRef, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const weekdayMap = {
  1: "星期一",
  2: "星期二",
  3: "星期三",
  4: "星期四",
  5: "星期五",
  6: "星期六",
  7: "星期日",
};

function CourseTable({ courseTable, onDelete, timeSlots }) {
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelButtonRef = useRef(null);
  const weekdays = Object.keys(weekdayMap);
  const weekdayLabels = Object.values(weekdayMap);

  useEffect(() => {
    if (!courseToDelete) return undefined;

    cancelButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        setCourseToDelete(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [courseToDelete, isDeleting]);

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setCourseToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!courseToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(courseToDelete.courseId);
      setCourseToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="tm-panel overflow-x-auto p-2">
        <table className="w-full min-w-[980px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="tm-table-head rounded-l-2xl px-5 py-4 text-left text-sm font-extrabold">
              時間
            </th>
            {weekdayLabels.map((day, index) => (
              <th
                key={day}
                className={`tm-table-head px-5 py-4 text-center text-sm font-extrabold ${
                  index === weekdayLabels.length - 1 ? "rounded-r-2xl" : ""
                }`}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot} className="transition-colors">
              <td className="border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-[#12345c] first:rounded-l-2xl">
                {slot}
              </td>
              {weekdays.map((weekday) => {
                const course = courseTable[slot]?.[weekday];

                return (
                  <td
                    key={weekday}
                    className={`group relative whitespace-pre-line border-b border-slate-200 px-4 py-3 text-center align-middle ${
                      course
                        ? "bg-yellow-50/80 font-bold text-slate-900"
                        : "bg-white text-slate-400"
                    }`}
                  >
                    {course ? (
                      <div className="course-chip relative mx-auto flex min-h-11 min-w-[150px] max-w-[180px] items-center justify-center rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm font-extrabold text-[#12345c] shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-red-100 group-hover:shadow-[0_16px_28px_-24px_rgba(220,38,38,0.65)]">
                          <span className="w-full truncate text-center">
                            {course.courseName}
                          </span>
                        <button
                          aria-label={`刪除 ${course.courseName}`}
                          className="course-delete absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-600 opacity-0 shadow-sm transition-all duration-200 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/30 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-200 active:scale-95 group-hover:opacity-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            setCourseToDelete(course);
                          }}
                          title="刪除課程"
                          type="button"
                        >
                          <FaTrashAlt className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {courseToDelete ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onClick={closeDeleteDialog}
          role="presentation"
        >
          <div
            aria-describedby="course-delete-dialog-description"
            aria-labelledby="course-delete-dialog-title"
            aria-modal="true"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600">
                <FaTrashAlt className="h-4 w-4" />
              </span>
              <div>
                <h2
                  className="text-lg font-extrabold text-slate-900"
                  id="course-delete-dialog-title"
                >
                  確認刪除課程
                </h2>
                <p
                  className="mt-1 text-sm leading-6 text-slate-500"
                  id="course-delete-dialog-description"
                >
                  刪除後無法復原，請確認是否繼續。
                </p>
              </div>
            </div>

            <div className="px-6 py-5">
              <p className="rounded-2xl bg-slate-50 px-4 py-3 text-center font-extrabold text-slate-800">
                {courseToDelete.courseName}
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                className="tm-secondary-btn px-5 py-2.5"
                disabled={isDeleting}
                onClick={closeDeleteDialog}
                ref={cancelButtonRef}
                type="button"
              >
                取消
              </button>
              <button
                className="rounded-2xl bg-red-600 px-5 py-2.5 font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeleting}
                onClick={confirmDelete}
                type="button"
              >
                {isDeleting ? "刪除中…" : "確認刪除"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default CourseTable;
