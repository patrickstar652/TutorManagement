import { useState } from "react";
import { FaBell, FaCalendarAlt, FaClock, FaStickyNote } from "react-icons/fa";

function Reminder({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    time: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("提醒事項數據:", formData);
    // 在這裡添加提交邏輯
    if (onClose) onClose();
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 標題區域 */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaBell className="text-2xl" />
              <h2 className="text-2xl font-bold">新增提醒事項</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 表單內容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 標題輸入 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              提醒標題 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="請輸入提醒標題..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
              required
            />
          </div>

          {/* 內容輸入 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <FaStickyNote className="inline mr-2" />
              提醒內容
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="請輸入詳細內容..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
            />
          </div>

          {/* 日期和時間 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <FaCalendarAlt className="inline mr-2" />
                日期 *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <FaClock className="inline mr-2" />
                時間
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          {/* 按鈕區域 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              建立提醒
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reminder;