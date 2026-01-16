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
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden transform transition-all border border-white/50 ring-1 ring-black/5">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              更新繳費狀態
            </h2>
            <p className="text-slate-500 text-sm mt-1">請輸入最新的繳費資訊</p>
          </div>

          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                金額
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-green-500 transition-colors">
                  $
                </span>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  type="text"
                  placeholder="500"
                  className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-slate-800 font-semibold placeholder-slate-400 focus:bg-white focus:border-green-500/30 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                繳費狀態
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-slate-800 font-semibold focus:bg-white focus:border-green-500/30 focus:ring-4 focus:ring-green-500/10 outline-none transition-all duration-200 appearance-none cursor-pointer"
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
                className="flex-1 px-4 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200"
              >
                取消
              </button>
              <button
                onClick={fetchData}
                className="flex-1 px-4 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
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
