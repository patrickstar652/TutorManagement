import Navbar from "../component/Navbar";
import AddSeat from "../component/AddSeat";
import Reminder from "../component/Reminder";
import Payment from "../component/Payment";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Seat() {
  const { scheduleId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [seatData, setSeatData] = useState({});
  const [activeTab, setActiveTab] = useState("seats");

  // 載入座位資料
  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/seat/${scheduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          const seats = {};
          response.data.data.forEach((seat) => {
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
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/seat/${scheduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          const seats = {};
          response.data.data.forEach((seat) => {
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
        className={`flex h-14 w-16 cursor-pointer flex-col items-center justify-center rounded-2xl border text-sm shadow-sm transition-all hover:-translate-y-0.5 ${
          isSeatOccupied(seatId)
            ? "border-[#12345c] bg-[#12345c] text-white hover:bg-[#0b2545]"
            : "border-slate-200 bg-white text-slate-500 hover:border-[#12345c]/30 hover:bg-slate-50"
        }`}
      >
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap px-1 text-center font-bold">
          {getSeatName(seatId)}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {/* <Sidebar /> */}
      <div className="tm-page">
      <div className="tm-shell flex flex-col items-center pt-10">
        <span className="tm-section-kicker mb-3">班級管理</span>
        <h1 className="tm-section-title">
          班級狀況
        </h1>
        <div className="tm-title-underline"></div>

        {/* 切換按鈕 */}
        <div className="mt-7 flex flex-wrap justify-center gap-2 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-[0_14px_34px_-30px_rgba(15,35,65,0.34)]">
          <button
            onClick={() => setActiveTab("seats")}
            className={`rounded-2xl px-5 py-2.5 text-sm font-extrabold transition-all ${
              activeTab === "seats"
                ? "bg-[#12345c] text-white shadow-lg shadow-slate-900/10"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#12345c]"
            }`}
          >
            座位管理
          </button>
          <button
            onClick={() => setActiveTab("reminders")}
            className={`rounded-2xl px-5 py-2.5 text-sm font-extrabold transition-all ${
              activeTab === "reminders"
                ? "bg-[#12345c] text-white shadow-lg shadow-slate-900/10"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#12345c]"
            }`}
          >
            提醒事項
          </button>
          <button
            className={`rounded-2xl px-5 py-2.5 text-sm font-extrabold transition-all ${
              activeTab === "payments"
                ? "bg-[#12345c] text-white shadow-lg shadow-slate-900/10"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#12345c]"
            }`}
            onClick={() => setActiveTab("payments")}
          >
            繳費狀態
          </button>
        </div>
      </div>

      <div className="tm-shell mx-auto py-10">
        {/* 根據狀態顯示不同內容 */}
        {activeTab === "seats" && (
          // 座位管理區塊
          <div className="tm-panel p-5 sm:p-8">
            <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-900">
              教室座位表
            </h2>

            {/* 螢幕區域 */}
            <div className="mx-auto mb-10 flex h-12 w-full max-w-xl items-center justify-center rounded-[1.25rem] bg-black text-center font-extrabold text-white shadow-[0_16px_28px_-22px_rgba(0,0,0,0.55)]">
              講台
            </div>

            {/* 座位區域 */}
            <div className="mx-auto mb-8 max-w-4xl overflow-x-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)]">
              {/* 第一列 */}
              <div className="mb-5 flex min-w-[520px] justify-center gap-12 sm:gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("L1-1")}
                  {renderSeat("L1-2")}
                  {renderSeat("L1-3")}
                </div>

                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("R1-1")}
                  {renderSeat("R1-2")}
                  {renderSeat("R1-3")}
                </div>
              </div>

              {/* 第二列 */}
              <div className="mb-5 flex min-w-[520px] justify-center gap-12 sm:gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("L2-1")}
                  {renderSeat("L2-2")}
                  {renderSeat("L2-3")}
                </div>

                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("R2-1")}
                  {renderSeat("R2-2")}
                  {renderSeat("R2-3")}
                </div>
              </div>

              {/* 第三列 */}
              <div className="mb-5 flex min-w-[520px] justify-center gap-12 sm:gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("L3-1")}
                  {renderSeat("L3-2")}
                  {renderSeat("L3-3")}
                </div>

                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("R3-1")}
                  {renderSeat("R3-2")}
                  {renderSeat("R3-3")}
                </div>
              </div>

              {/* 第四列 */}
              <div className="mb-5 flex min-w-[520px] justify-center gap-12 sm:gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("L4-1")}
                  {renderSeat("L4-2")}
                  {renderSeat("L4-3")}
                </div>

                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("R4-1")}
                  {renderSeat("R4-2")}
                  {renderSeat("R4-3")}
                </div>
              </div>

              {/* 第五列 */}
              <div className="mb-5 flex min-w-[520px] justify-center gap-12 sm:gap-16">
                {/* 左側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("L5-1")}
                  {renderSeat("L5-2")}
                  {renderSeat("L5-3")}
                </div>

                {/* 右側桌子 */}
                <div className="flex gap-1">
                  {renderSeat("R5-1")}
                  {renderSeat("R5-2")}
                  {renderSeat("R5-3")}
                </div>
              </div>
            </div>

            {/* 圖例說明 */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold text-slate-600">
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
                <div className="h-5 w-5 rounded-lg border border-slate-200 bg-white"></div>
                <span>可用座位</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
                <div className="h-5 w-5 rounded-lg bg-[#12345c]"></div>
                <span>已占用</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
                <div className="h-5 w-5 rounded-lg bg-slate-300"></div>
                <span>不可用</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === "reminders" && <Reminder />}
        {activeTab === "payments" && <Payment />}
      </div>
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
