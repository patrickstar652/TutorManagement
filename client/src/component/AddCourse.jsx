import { useState } from "react";
import axios from "axios";
import { TimePicker } from "antd";
import "antd/dist/reset.css";

function AddCourse() {
  const close = () => {
    document.querySelector(".popupWindow").classList.add("hidden");
  };

  // 全底線命名
  const [course_name, set_course_name] = useState("");
  const [weekday, set_weekday] = useState("");       // 使用者未選時是空字串
  const [start_time, set_start_time] = useState(null); // antd v5 dayjs
  const [end_time, set_end_time] = useState(null);

  const handleForm = async (e) => {
    e.preventDefault();

    // 前端基本驗證
    if (!course_name || !weekday || !start_time || !end_time) {
      console.warn("請完整填寫欄位");
      return;
    }
    // 時間檢查：下課必須晚於上課
    if (end_time.isSame(start_time) || end_time.isBefore(start_time)) {
      alert("下課時間必須晚於上課時間");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        course_name,
        weekday: Number(weekday),                 // 確保是數字
        start_time: start_time.format("HH:mm"),
        end_time: end_time.format("HH:mm"),
      };

      await axios.post("http://localhost:3000/course", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 先廣播 → 再關視窗（確保監聽端能接到）
      window.dispatchEvent(
        new CustomEvent("course:changed", { detail: { type: "created" } })
      );

      // 清空表單（可選）
      set_course_name("");
      set_weekday("");
      set_start_time(null);
      set_end_time(null);

      close();
    } catch (error) {
      console.error("❌ 新增課程失敗:", error);
      
      // 處理錯誤訊息
      let errorMessage = "新增課程失敗，請稍後再試";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-stone-50">
        <div className="popupWindow hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-2xl w-[30rem] p-8 z-50 animate-fadeIn">
            <form onSubmit={handleForm}>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
                加入課表
              </h3>

              <div className="flex flex-col space-y-4">
                {/* 課程名稱 */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">課程名稱</label>
                  <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="請輸入課程名稱"
                    value={course_name}
                    onChange={(e) => set_course_name(e.target.value)}
                    required
                  />
                </div>

                {/* 星期幾 */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">上課星期</label>
                  <select
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={weekday}
                    onChange={(e) => set_weekday(Number(e.target.value))}
                  >
                    <option value="" disabled>請選擇星期</option>
                    <option value={1}>星期一</option>
                    <option value={2}>星期二</option>
                    <option value={3}>星期三</option>
                    <option value={4}>星期四</option>
                    <option value={5}>星期五</option>
                    <option value={6}>星期六</option>
                    <option value={7}>星期日</option>
                  </select>
                </div>

                {/* 上課時間 */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">上課時間</label>
                  <TimePicker
                    required
                    format="HH:mm"
                    minuteStep={30}
                    onChange={(v) => set_start_time(v)}
                    value={start_time}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    disabledTime={() => ({
                      disabledHours: () =>
                        Array.from({ length: 9 }, (_, i) => i).concat(
                          Array.from({ length: 2 }, (_, i) => 22 + i)
                        ),
                      disabledMinutes: () => [],
                      disabledSeconds: () => [],
                    })}
                  />
                </div>

                {/* 下課時間 */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">下課時間</label>
                  <TimePicker
                    required
                    format="HH:mm"
                    minuteStep={30}
                    onChange={(v) => set_end_time(v)}
                    value={end_time}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    disabledTime={() => ({
                      disabledHours: () =>
                        Array.from({ length: 9 }, (_, i) => i).concat(
                          Array.from({ length: 2 }, (_, i) => 22 + i)
                        ),
                      disabledMinutes: () => [],
                      disabledSeconds: () => [],
                    })}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  確認
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 py-2.5 px-4 bg-gray-400 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  關閉
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCourse;
