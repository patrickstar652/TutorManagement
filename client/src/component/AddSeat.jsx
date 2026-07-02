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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-28px_rgba(15,35,65,0.48)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-extrabold text-slate-900">
            編輯座位 {seatId}
          </h3>
          <button 
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#12345c]"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              學生姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="tm-input"
              placeholder="請輸入學生姓名"
            />
          </div>
                  
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={close}
              className="tm-secondary-btn px-4 py-2"
            >
              取消
            </button>
            <button
              type="submit"
              className="tm-primary-btn px-4 py-2"
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
