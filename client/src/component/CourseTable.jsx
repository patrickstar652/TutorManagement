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
                      <>
                        <div className="mx-auto rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-[#12345c] shadow-sm">
                          {course.courseName}
                        </div>
                        <div
                          className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 translate-y-[-8px] pb-2 opacity-0 transition-all delay-200 duration-500 ease-out hover:translate-y-0 hover:opacity-100 hover:delay-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-0"
                        >
                          <div
                            className="min-w-[120px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl transition-shadow duration-300 before:absolute before:left-1/2 before:top-[-6px] before:h-0 before:w-0 before:-translate-x-1/2 before:border-b-[6px] before:border-l-[6px] before:border-r-[6px] before:border-b-white before:border-l-transparent before:border-r-transparent before:drop-shadow-sm hover:shadow-2xl"
                          >
                            <button
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 ease-out hover:scale-105 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 active:scale-95"
                              onClick={() => onDelete(course.courseId)}
                              type="button"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              刪除
                            </button>
                          </div>
                        </div>
                      </>
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
