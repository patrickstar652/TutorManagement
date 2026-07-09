import { useState } from "react";
import { message } from "antd";
import { getApiErrorMessage } from "../api/axiosClient";
import {
  FaBell,
  FaCalendarAlt,
  FaClock,
  FaStickyNote,
  FaTimes,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";

function AddReminder({ onClose, onCreate, scheduleId, courseName }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    time: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date) {
      message.warning("請填寫標題和日期");
      return;
    }

    if (!scheduleId) {
      message.error("錯誤：缺少課程資訊，請從課程頁面重新進入");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.content,
        remind_date: formData.date,
        remind_at: formData.time || null,
        schedule_id: scheduleId,
      };

      await onCreate(payload);

      setFormData({
        title: "",
        content: "",
        date: "",
        time: "",
      });
    } catch (err) {
      console.error("建立提醒失敗:", err);
      message.error(getApiErrorMessage(err, "建立提醒失敗，請稍後再試"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur and darken */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <style>
        {`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-slide-up {
            animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>

      {/* Main Card */}
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-slide-up border border-white/40 ring-1 ring-black/5">
        {/* Subtle decorative background accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
        <div className="absolute top-10 -left-20 w-64 h-64 bg-yellow-50 rounded-full blur-3xl opacity-80 pointer-events-none"></div>

        {/* Content */}
        <div className="relative px-8 pt-8 pb-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-[#12345c] shadow-sm border border-slate-200">
                <FaBell className="text-xl" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  新增提醒
                </h2>
                {courseName && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
                    <span className="text-sm font-medium text-slate-500">
                      {courseName}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div
              className={`transition-all duration-200 ${
                activeField === "title" ? "scale-[1.01]" : ""
              }`}
            >
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                提醒標題
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onFocus={() => setActiveField("title")}
                onBlur={() => setActiveField("")}
                placeholder="例如：期中考複習、作業繳交"
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-slate-700 font-semibold placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#12345c]/20 transition-all duration-200 outline-none"
                required
              />
            </div>

            {/* Content Textarea */}
            <div
              className={`transition-all duration-200 ${
                activeField === "content" ? "scale-[1.01]" : ""
              }`}
            >
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                詳細內容{" "}
                <span className="text-slate-300 font-normal normal-case tracking-normal ml-1">
                  (選填)
                </span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                onFocus={() => setActiveField("content")}
                onBlur={() => setActiveField("")}
                placeholder="輸入更多細節..."
                rows="3"
                className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl text-slate-700 font-medium placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#12345c]/20 transition-all duration-200 outline-none resize-none"
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`transition-all duration-200 ${
                  activeField === "date" ? "scale-[1.01]" : ""
                }`}
              >
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  日期
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    onFocus={() => setActiveField("date")}
                    onBlur={() => setActiveField("")}
                    className="w-full px-5 py-3.5 pl-11 bg-slate-50 border-0 rounded-2xl text-slate-700 font-semibold focus:bg-white focus:ring-2 focus:ring-[#12345c]/20 transition-all duration-200 outline-none appearance-none"
                    required
                  />
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97316] pointer-events-none" />
                </div>
              </div>
              <div
                className={`transition-all duration-200 ${
                  activeField === "time" ? "scale-[1.01]" : ""
                }`}
              >
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                  時間
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    onFocus={() => setActiveField("time")}
                    onBlur={() => setActiveField("")}
                    className="w-full px-5 py-3.5 pl-11 bg-slate-50 border-0 rounded-2xl text-slate-700 font-semibold focus:bg-white focus:ring-2 focus:ring-[#12345c]/20 transition-all duration-200 outline-none appearance-none"
                  />
                  <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f97316] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors duration-200"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 group relative px-8 py-4 bg-[#12345c] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>處理中...</span>
                    </>
                  ) : (
                    <>
                      <span>建立提醒</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddReminder;
