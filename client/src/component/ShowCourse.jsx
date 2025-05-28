import { useState, useEffect } from "react";
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

  useEffect(() => {
    // 定義非同步函數獲取課程資料
    const fetchData = async () => {
      try {
        // 發送 GET 請求獲取課程資料
        const res = await axios.get("http://localhost:3000/showcourse");
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
          // 初始化每個星期的課程為空字串
          for (let i = 1; i <= 7; i++) {
            table[slot][i] = ""; //星期/時間
          }
        });

        // step 3：填入課程資料
        res.data.forEach((item) => {
          // 組合時間區段
          const slot = `${item.startTime.slice(0, 5)}~${item.endTime.slice(0, 5)}`;
          // 組合課程內容（課程名稱和備註）
          const content = `${item.courseName}`;
          // 如果該時段存在，則填入課程內容
          if (table[slot]) {
            table[slot][item.day] = content;
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
  }, []); // 空依賴陣列表示只在組件首次渲染時執行

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
              >
                {/* 時間區段欄位 */}
                <td className="py-4 px-6 bg-gray-50 font-medium">{slot}</td>
                {/* 遍歷每個星期的課程 */}
                {Object.keys(weekdayMap).map((day) => (
                  <td
                    key={day}
                    className="py-4 px-6 text-center whitespace-pre-line"
                  >
                    {courseTable[slot][day]}
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