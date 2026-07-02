import React from "react";
import { useState } from "react";
import axios from "axios";

function AddPayment({ onClose, student, scheduleId }) {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("未繳");
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        scheduleId,
        student,
        amount,
        status,
      };
      const response = await axios.patch(`http://localhost:3000/payment`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Main Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_54px_-28px_rgba(15,35,65,0.42)] ring-1 ring-slate-200/70 transition-all">
        {/* Subtle top accent */}
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-[#38bdf8]"></div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              更新繳費狀態
            </h2>
            <p className="text-slate-500 text-sm mt-1">請輸入最新的繳費資訊</p>
          </div>

          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="ml-1 mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                金額
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 transition-colors group-focus-within:text-[#12345c]">
                  $
                </span>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  type="text"
                  placeholder="500"
                  className="tm-input pl-8"
                />
              </div>
            </div>

            {/* Status Select */}
            <div>
              <label className="ml-1 mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                繳費狀態
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                  className="tm-input cursor-pointer appearance-none"
                >
                  <option value="已繳">已繳</option>
                  <option value="未繳">未繳</option>
                </select>
                {/* Custom Arrow Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="tm-secondary-btn flex-1 px-4 py-3.5"
              >
                取消
              </button>
              <button
                onClick={fetchData}
                className="tm-primary-btn flex-1 px-4 py-3.5"
              >
                確認更新
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddPayment;
