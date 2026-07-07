import Navbar from "../component/Navbar";
import AddSeat from "../component/AddSeat";
import Reminder from "../component/Reminder";
import Payment from "../component/Payment";
import SeatGrid from "../component/SeatGrid";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getApiErrorMessage } from "../api/axiosClient";
import { useSeats } from "../hooks/useSeats";

function Seat() {
  const { scheduleId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [activeTab, setActiveTab] = useState("seats");
  const { error, loading, saveSeat, seatMap } = useSeats(scheduleId);

  const handleSeatClick = (seatId) => {
    setSelectedSeatId(seatId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSeatId(null);
  };

  const handleSaveSeat = async (name) => {
    try {
      await saveSeat({ seatId: selectedSeatId, name });
      handleCloseModal();
    } catch (error) {
      alert(getApiErrorMessage(error, "儲存座位失敗，請稍後再試"));
    }
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
          <SeatGrid
            error={error}
            loading={loading}
            onSeatClick={handleSeatClick}
            seatMap={seatMap}
          />
        )}
        {activeTab === "reminders" && <Reminder />}
        {activeTab === "payments" && <Payment />}
      </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddSeat
          seatId={selectedSeatId}
          onClose={handleCloseModal}
          onSave={handleSaveSeat}
        />
      )}
    </>
  );
}

export default Seat;
