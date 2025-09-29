import { useState } from "react";
import axios from "axios";

function AddSeat({ scheduleId, seatId, onClose, onSave }) { // 接收 onSave props
  const [name, setName] = useState("");
  
  const close = () => {
    setName(""); // 清空表單
    onClose(); // 使用 props 傳入的關閉函數
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch("http://localhost:3000/seat", { // 改為 PATCH
        schedule_id: scheduleId,
        seat_id: seatId,
        name
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (onSave) {
        onSave(); // 通知父元件重新載入資料
      }
      close();
    } catch(error) {
      console.error("儲存失敗:", error);
      alert("儲存失敗，請稍後再試");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">
            編輯座位 {seatId}
          </h3>
          <button 
            onClick={close}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              學生姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入學生姓名"
            />
          </div>
                  
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSeat;