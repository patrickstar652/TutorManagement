import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// 定義星期對照表
const weekdayMap = {
  1: "星期一",
  2: "星期二",
  3: "星期三",
  4: "星期四",
  5: "星期五",
  6: "星期六",
  7: "星期日",
};

function ShowCourse() {
  const [course, setCourse] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [courseTable, setCourseTable] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // ✅ 刷新觸發器

  const { courseId } = useParams();

  // ✅ 把抓課程資料邏輯抽成函式
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/showcourse", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourse(res.data);

      // step 1：產生時間區段
      const slots = Array.from(
        new Set(
          res.data.map((item) => {
            const start = item.start_time.slice(0, 5);
            const end = item.end_time.slice(0, 5);
            return `${start}~${end}`;
          })
        )
      ).sort();
      setTimeSlots(slots);

      // step 2：初始化表格資料
      const table = {};
      slots.forEach((slot) => {
        table[slot] = {};
        for (let i = 1; i <= 7; i++) {
          table[slot][i] = "";
        }
      });

      // step 3：填入課程資料
      res.data.forEach((item) => {
        const slot = `${item.start_time.slice(0, 5)}~${item.end_time.slice(
          0,
          5
        )}`;
        if (table[slot]) {
          table[slot][item.weekday] = {
            courseId: item.id,
            courseName: item.course_name,
          };
        }
      });

      setCourseTable(table);
    } catch (error) {
      console.error("資料載入錯誤：", error);
    }
  }, []);

  // ✅ 監聽 refreshKey，每次改變就重抓
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // ✅ 監聽全域事件（新增/刪除後會觸發刷新）
  useEffect(() => {
    const onChanged = () => setRefreshKey((k) => k + 1);
    window.addEventListener("course:changed", onChanged);
    return () => window.removeEventListener("course:changed", onChanged);
  }, []);

  // 刪除課程
  const handleDelete = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/deletecourse/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // ✅ 刪除成功後通知刷新
      window.dispatchEvent(
        new CustomEvent("course:changed", { detail: { type: "deleted", id: courseId } })
      );
    } catch (error) {
      console.error("刪除課程失敗：", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-visible">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold">時間</th>
              {Object.values(weekdayMap).map((day, i) => (
                <th key={i} className="py-4 px-6 text-center font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, i) => (
              <tr key={i} className="border-b border-gray-200 transition-colors">
                <td className="py-4 px-6 bg-gray-50 font-medium">{slot}</td>
                {Object.keys(weekdayMap).map((day) => (
                  <td
                    key={day}
                    className={`py-4 px-6 text-center whitespace-pre-line relative group ${
                      courseTable[slot] && courseTable[slot][day]
                        ? "bg-amber-100 font-bold text-amber-900"
                        : ""
                    }`}
                  >
                    {courseTable[slot] && courseTable[slot][day] ? (
                      <>
                        <div>{courseTable[slot][day]?.courseName}</div>
                        <div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1
                                      opacity-0 group-hover:opacity-100 
                                      translate-y-[-8px] group-hover:translate-y-0
                                      transition-all duration-500 ease-out delay-200
                                      group-hover:delay-0
                                      z-50 pointer-events-none group-hover:pointer-events-auto
                                      hover:opacity-100 hover:translate-y-0 hover:delay-0
                                      pb-2"
                        >
                          <div
                            className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[120px]
                                        before:absolute before:top-[-6px] before:left-1/2 before:transform before:-translate-x-1/2
                                        before:w-0 before:h-0 before:border-l-[6px] before:border-r-[6px] before:border-b-[6px]
                                        before:border-l-transparent before:border-r-transparent before:border-b-white
                                        before:drop-shadow-sm
                                        hover:shadow-2xl transition-shadow duration-300"
                          >
                            <button
                              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                                       text-white text-sm font-medium px-4 py-2.5 rounded-lg 
                                       transition-all duration-200 ease-out
                                       hover:scale-105 hover:shadow-lg hover:shadow-red-500/40
                                       active:scale-95
                                       flex items-center justify-center gap-2
                                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                              onClick={() => {
                                handleDelete(courseTable[slot][day]?.courseId);
                              }}
                            >
                              <svg
                                className="w-4 h-4"
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
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ShowCourse;
