import { useState } from "react";
import axios from "axios";
import { TimePicker } from "antd";
import "antd/dist/reset.css";
function AddCourse() {
  const close = () => {
    document.querySelector(".popupWindow").classList.add("hidden");
  };
  const [courseName, setCourseName] = useState("");
  const [day, setDay] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const handleForm = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        
        await axios.post("http://localhost:3000/course", {
        courseName,
        day,
        startTime: startTime.format("HH:mm"),
        endTime: endTime.format("HH:mm"),
        note,
    }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
    close();
    }
    catch (error) {
        console.error(error);
    }
    
  };
  return (
    <>
      <div className="min-h-screen bg-stone-50">
        <div className="popupWindow hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-2xl w-[30rem] p-8 z-50 animate-fadeIn">
            <form onSubmit={handleForm}>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
                課程編輯
              </h3>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    課程名稱
                  </label>
                  <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="請輸入課程名稱"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    上課星期
                  </label>
                  <select
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                  >
                    <option disabled hidden>
                      請選擇星期
                    </option>
                    <option value={1}>星期一</option>
                    <option value={2}>星期二</option>
                    <option value={3}>星期三</option>
                    <option value={4}>星期四</option>
                    <option value={5}>星期五</option>
                    <option value={6}>星期六</option>
                    <option value={7}>星期日</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    上課時間
                  </label>
                  <TimePicker
                    required
                    format="HH:mm"
                    minuteStep={30} // 30 分鐘跳動
                    onChange={(value) => setStartTime(value)}
                    value={startTime}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    disabledTime={() => ({
                      disabledHours: () =>
                        Array.from({ length: 9 }, (_, i) => i).concat(
                          Array.from({ length: 2 }, (_, i) => 22 + i)
                        ),
                      disabledMinutes: () => [],
                      disabledSeconds: () => [],
                    })} // 禁止時間選擇
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    下課時間
                  </label>
                  <TimePicker
                    required
                    format="HH:mm"
                    minuteStep={30} // 30 分鐘跳動
                    onChange={(value) => setEndTime(value)}
                    value={endTime}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    disabledTime={() => ({
                      disabledHours: () =>
                        Array.from({ length: 9 }, (_, i) => i).concat(
                          Array.from({ length: 2 }, (_, i) => 22 + i)
                        ),
                      disabledMinutes: () => [],
                      disabledSeconds: () => [],
                    })} // 禁止時間選擇
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    備註說明
                  </label>
                  <textarea
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows="3"
                    placeholder="請輸入備註說明"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
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
