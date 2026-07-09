import { useState } from "react";
import { TimePicker, message } from "antd";
import "antd/dist/reset.css";
import { getApiErrorMessage } from "../api/axiosClient";

function AddCourse({ onClose, onCreate, open }) {
  // 全底線命名
  const [course_name, set_course_name] = useState("");
  const [weekday, set_weekday] = useState("");       // 使用者未選時是空字串
  const [start_time, set_start_time] = useState(null); // antd v5 dayjs
  const [end_time, set_end_time] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    set_course_name("");
    set_weekday("");
    set_start_time(null);
    set_end_time(null);
  };

  const close = () => {
    resetForm();
    onClose();
  };

  const handleForm = async (e) => {
    e.preventDefault();

    // 前端基本驗證
    if (!course_name || !weekday || !start_time || !end_time) {
      message.warning("請完整填寫課程資料");
      console.warn("請完整填寫欄位");
      return;
    }
    // 時間檢查：下課必須晚於上課
    if (end_time.isSame(start_time) || end_time.isBefore(start_time)) {
      message.warning("下課時間必須晚於上課時間");
      return;
    }

    setIsSaving(true);
    try {
      await onCreate({
        course_name,
        weekday: Number(weekday),                 // 確保是數字
        start_time: start_time.format("HH:mm"),
        end_time: end_time.format("HH:mm"),
      });

      resetForm();
    } catch (error) {
      console.error("❌ 新增課程失敗:", error);
      message.error(getApiErrorMessage(error, "新增課程失敗，請稍後再試"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-stone-50">
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <div className="relative z-50 w-full max-w-[30rem] animate-fadeIn rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_60px_-28px_rgba(15,35,65,0.48)]">
            <form onSubmit={handleForm}>
              <h3 className="mb-6 text-center text-2xl font-extrabold text-slate-900">
                加入課表
              </h3>

              <div className="flex flex-col space-y-4">
                {/* 課程名稱 */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-bold text-slate-700">課程名稱</label>
                  <input
                    type="text"
                    className="tm-input"
                    placeholder="請輸入課程名稱"
                    value={course_name}
                    onChange={(e) => set_course_name(e.target.value)}
                    required
                  />
                </div>

                {/* 星期幾 */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-bold text-slate-700">上課星期</label>
                  <select
                    required
                    className="tm-input"
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
                  <label className="text-sm font-bold text-slate-700">上課時間</label>
                  <TimePicker
                    required
                    format="HH:mm"
                    minuteStep={30}
                    onChange={(v) => set_start_time(v)}
                    value={start_time}
                    className="tm-input"
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
                  <label className="text-sm font-bold text-slate-700">下課時間</label>
                  <TimePicker
                    required
                    format="HH:mm"
                    minuteStep={30}
                    onChange={(v) => set_end_time(v)}
                    value={end_time}
                    className="tm-input"
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
                  className="tm-primary-btn flex-1 py-2.5"
                  disabled={isSaving}
                >
                  {isSaving ? "儲存中..." : "確認"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="tm-secondary-btn flex-1 py-2.5"
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
