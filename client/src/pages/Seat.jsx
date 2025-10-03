import Navbar from "../component/Navbar";
import AddSeat from "../component/AddSeat";
import Sidebar from "../component/Sidebar";
import Reminder from "../component/Reminder";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Seat() {
  const { scheduleId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [seatData, setSeatData] = useState({});
  const [showReminders, setShowReminders] = useState(false);

  // 載入座位資料
  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/seat/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const seats = {};
          response.data.data.forEach(seat => {
            seats[seat.seat_id] = seat.name;
          });
          setSeatData(seats);
        }
      } catch (error) {
        console.error("載入座位資料失敗:", error);
      }
    };

    if (scheduleId) {
      fetchSeatData();
    }
  }, [scheduleId]);

  const handleSeatClick = (seatId) => {
    setSelectedSeatId(seatId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSeatId(null);
  };

  const handleSaveSuccess = () => {
    // 重新載入座位資料
    const fetchSeatData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/seat/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const seats = {};
          response.data.data.forEach(seat => {
            seats[seat.seat_id] = seat.name;
          });
          setSeatData(seats);
        }
      } catch (error) {
        console.error("載入座位資料失敗:", error);
      }
    };
    fetchSeatData();
  };

  // 取得座位顯示的名字，如果沒有資料則顯示 "-"
  const getSeatName = (seatId) => {
    return seatData[seatId] || "-";
  };

  // 判斷座位是否已占用
  const isSeatOccupied = (seatId) => {
    return seatData[seatId] && seatData[seatId].trim() !== "";
  };

  // 生成座位元件
  const renderSeat = (seatId) => {
    return (
      <div 
        key={seatId}
        onClick={() => handleSeatClick(seatId)}
        className={`w-16 h-14 flex flex-col items-center justify-center rounded-t-xl cursor-pointer transition-colors ${
          isSeatOccupied(seatId) 
            ? 'bg-blue-400 text-white hover:bg-blue-500' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-center px-1">
          {getSeatName(seatId)}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="flex flex-col items-center mt-6">
        <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">班級狀況</h1>
        <div className="h-1.5 w-40 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mt-1"></div>
        
        {/* 切換按鈕 */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setShowReminders(false)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              !showReminders 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            座位管理
          </button>
          <button
            onClick={() => setShowReminders(true)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              showReminders 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            提醒事項
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto my-12 px-4">
        {/* 根據狀態顯示不同內容 */}
        {!showReminders ? (
          // 座位管理區塊
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">教室座位表</h2>
            
            {/* 螢幕區域 */}
            <div className="w-3/5 h-12 mx-auto mb-12 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-center text-white flex items-center justify-center shadow-md">
              講台
            </div>
            
            {/* 座位區域 */}
            <div className="max-w-4xl mx-auto mb-8">
              {/* 第一列 */}
              <div className="flex justify-center mb-5 gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  <div 
                    onClick={() => handleSeatClick('L1-1')}
                    className={`w-16 h-14 flex flex-col items-center justify-center rounded-t-xl cursor-pointer transition-colors ${
                      isSeatOccupied('L1-1') 
                        ? 'bg-blue-400 text-white hover:bg-blue-500' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-center px-1">
                      {getSeatName('L1-1')}
                    </div>
                  </div>
                  <div 
                    onClick={() => handleSeatClick('L1-2')}
                    className={`w-16 h-14 flex flex-col items-center justify-center rounded-t-xl cursor-pointer transition-colors ${
                      isSeatOccupied('L1-2') 
                        ? 'bg-blue-400 text-white hover:bg-blue-500' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-center px-1">
                      {getSeatName('L1-2')}
                    </div>
                  </div>
                  <div 
                    onClick={() => handleSeatClick('L1-3')}
                    className={`w-16 h-14 flex flex-col items-center justify-center rounded-t-xl cursor-pointer transition-colors ${
                      isSeatOccupied('L1-3') 
                        ? 'bg-blue-400 text-white hover:bg-blue-500' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-center px-1">
                      {getSeatName('L1-3')}
                    </div>
                  </div>
                </div>
                
                {/* 右側桌子 */}
                <div className="flex gap-1">
                  <div 
                    onClick={() => handleSeatClick('R1-1')}
                    className={`w-16 h-14 flex flex-col items-center justify-center rounded-t-xl cursor-pointer transition-colors ${
                      isSeatOccupied('R1-1') 
                        ? 'bg-blue-400 text-white hover:bg-blue-500' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-center px-1">
                      {getSeatName('R1-1')}
                    </div>
                  </div>
                  <div 
                    onClick={() => handleSeatClick('R1-2')}
                    className={`w-16 h-14 flex flex-col items-center justify-center rounded-t-xl cursor-pointer transition-colors ${
                      isSeatOccupied('R1-2') 
                        ? 'bg-blue-400 text-white hover:bg-blue-500' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-center px-1">
                      {getSeatName('R1-2')}
                    </div>
                  </div>
                  <div 
                    onClick={() => handleSeatClick('R1-3')}
                    className={`w-16 h-14 flex flex-col items-center justify-center rounded-t-xl cursor-pointer transition-colors ${
                      isSeatOccupied('R1-3') 
                        ? 'bg-blue-400 text-white hover:bg-blue-500' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-center px-1">
                      {getSeatName('R1-3')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 第二列 */}
              <div className="flex justify-center mb-5 gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat('L2-1')}
                  {renderSeat('L2-2')}
                  {renderSeat('L2-3')}
                </div>
                
                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat('R2-1')}
                  {renderSeat('R2-2')}
                  {renderSeat('R2-3')}
                </div>
              </div>

              {/* 第三列 */}
              <div className="flex justify-center mb-5 gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat('L3-1')}
                  {renderSeat('L3-2')}
                  {renderSeat('L3-3')}
                </div>
                
                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat('R3-1')}
                  {renderSeat('R3-2')}
                  {renderSeat('R3-3')}
                </div>
              </div>

              {/* 第四列 */}
              <div className="flex justify-center mb-5 gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat('L4-1')}
                  {renderSeat('L4-2')}
                  {renderSeat('L4-3')}
                </div>
                
                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat('R4-1')}
                  {renderSeat('R4-2')}
                  {renderSeat('R4-3')}
                </div>
              </div>

              {/* 第五列 */}
              <div className="flex justify-center mb-5 gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat('L5-1')}
                  {renderSeat('L5-2')}
                  {renderSeat('L5-3')}
                </div>
                
                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat('R5-1')}
                  {renderSeat('R5-2')}
                  {renderSeat('R5-3')}
                </div>
              </div>
            </div>
            
            {/* 圖例說明 */}
            <div className="flex justify-center gap-6 mt-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-t-xl bg-gray-200"></div>
                <span>可用座位</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-t-xl bg-blue-400"></div>
                <span>已占用</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-t-xl bg-gray-400"></div>
                <span>不可用</span>
              </div>
            </div>
          </div>
        ) : (
          // 提醒事項區塊
          <Reminder />
        )}
      </div>
      
      {/* Modal */}
      {showModal && (
        <AddSeat 
          scheduleId={scheduleId} 
          seatId={selectedSeatId}
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}
    </>
  );
}

export default Seat;