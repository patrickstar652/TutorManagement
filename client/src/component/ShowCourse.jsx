import { useState, useEffect } from "react";
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
  // 儲存從後端獲取的原始課程資料
  const [course, setCourse] = useState([]);
  // 儲存所有可能的時間段
  const [timeSlots, setTimeSlots] = useState([]);
  // 儲存處理後的課程表格資料
  const [courseTable, setCourseTable] = useState({});

  const { courseId } = useParams();

  const handleDelete = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/deletecourse/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("刪除課程失敗：", error);
    }
  };
  useEffect(() => {
    // 定義非同步函數獲取課程資料
    const fetchData = async () => {
      try {
        // 取得 token
        const token = localStorage.getItem("token");

        // 發送 GET 請求獲取課程資料，包含 Authorization header
        const res = await axios.get("http://localhost:3000/showcourse", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 儲存原始課程資料
        setCourse(res.data);

        // step 1：產生時間區段
        // 使用 Set 去除重複的時間段，並轉換為陣列
        const slots = Array.from(
          new Set(
            res.data.map((item) => {
              // 從時間字串中提取小時和分鐘
              const start = item.startTime.slice(0, 5);
              const end = item.endTime.slice(0, 5);
              // 組合成時間區段字串
              return `${start}~${end}`;
            })
          )
        ).sort(); // 排序時間區段
        // 儲存時間區段
        setTimeSlots(slots);

        // step 2：初始化表格資料
        const table = {};
        // 為每個時間區段建立空的課程表
        slots.forEach((slot) => {
          table[slot] = {}; // 中括號語法 二維結構
          // 初始化每個星期的課程為空字串 (1-7 對應星期一到星期日)
          for (let i = 1; i <= 7; i++) {
            table[slot][i] = ""; //星期/時間
          }
        });

        // step 3：填入課程資料
        res.data.forEach((item) => {
          // 組合時間區段
          const slot = `${item.startTime.slice(0, 5)}~${item.endTime.slice(
            0,
            5
          )}`;
          // 如果該時段存在，則填入課程內容
          if (table[slot]) {
            table[slot][item.day] = {
              courseId: item.id, // 使用從後端返回的 id
              courseName: item.courseName,
            };
          }
        });

        // 儲存處理後的課程表格資料
        setCourseTable(table);
      } catch (error) {
        console.error("資料載入錯誤：", error);
      }
    };

    // 執行資料獲取函數
    fetchData();
    // optional return function
    // return () => {}
  }, [courseTable]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-visible">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">
            <tr>
              {/* 時間欄位標題 */}
              <th className="py-4 px-6 text-left font-semibold">時間</th>
              {/* 星期欄位標題 */}
              {/* 把物件的「所有值」抽出來變成陣列 */}
              {Object.values(weekdayMap).map((day, i) => (
                <th key={i} className="py-4 px-6 text-center font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          {/* 表格內容 */}
          <tbody>
            {/* 遍歷時間區段 */}
            {timeSlots.map((slot, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 transition-colors"
              >
                {/* 時間區段欄位 */}
                <td className="py-4 px-6 bg-gray-50 font-medium">{slot}</td>
                {/* 遍歷每個星期的課程 */}
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
                        {/* 向下滑出的刪除區塊 */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1
                                      opacity-0 group-hover:opacity-100 
                                      translate-y-[-8px] group-hover:translate-y-0
                                      transition-all duration-500 ease-out delay-200
                                      group-hover:delay-0
                                      z-50 pointer-events-none group-hover:pointer-events-auto
                                      hover:opacity-100 hover:translate-y-0 hover:delay-0
                                      pb-2">
                          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[120px]
                                        before:absolute before:top-[-6px] before:left-1/2 before:transform before:-translate-x-1/2
                                        before:w-0 before:h-0 before:border-l-[6px] before:border-r-[6px] before:border-b-[6px]
                                        before:border-l-transparent before:border-r-transparent before:border-b-white
                                        before:drop-shadow-sm
                                        hover:shadow-2xl transition-shadow duration-300">
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
