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
  const weekdays = Object.keys(weekdayMap);
  const weekdayLabels = Object.values(weekdayMap);

  return (
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
                      <div className="relative mx-auto flex min-h-[52px] min-w-[180px] max-w-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-[#12345c] shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-red-100 group-hover:shadow-[0_16px_28px_-24px_rgba(220,38,38,0.65)]">
                          <span className="truncate">
                            {course.courseName}
                          </span>
                        <button
                          aria-label={`刪除 ${course.courseName}`}
                          className="absolute right-0 top-1/2 z-10 flex h-9 w-9 translate-x-[calc(100%+0.5rem)] -translate-y-1/2 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 opacity-0 shadow-sm transition-all duration-200 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/30 focus:translate-x-[calc(100%+0.25rem)] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-200 active:scale-95 group-hover:translate-x-[calc(100%+0.25rem)] group-hover:opacity-100"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDelete(course.courseId);
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
  );
}

export default CourseTable;
