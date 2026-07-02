import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddReminder from "./AddReminder";

function Reminder() {
  const { scheduleId } = useParams();
  const [reminders, setReminders] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const current = reminders[index] || null;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const params = scheduleId ? { scheduleId } : {};
      const res = await axios.get("http://localhost:3000/reminder", {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = res.data.success ? res.data.data : [];
      setReminders(Array.isArray(data) ? data : []);
      setIndex(0);
    } catch (e) {
      console.error("取得提醒失敗：", e);
      setErr("無法取得提醒事項");
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const prev = () =>
    setIndex((i) => (i - 1 + reminders.length) % reminders.length);
  const next = () => setIndex((i) => (i + 1) % reminders.length);

  useEffect(() => {
    const onKey = (e) => {
      if (isOpen) return;
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + reminders.length) % reminders.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % reminders.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, reminders.length]);

  const fmt = useMemo(
    () => ({
      date(dt) {
        if (!dt) return "--/--/--";
        const d = new Date(dt);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}/${String(d.getDate()).padStart(2, "0")}`;
      },
      time(dt) {
        if (!dt) return "--:--";
        const d = new Date(dt);
        return `${String(d.getHours()).padStart(2, "0")}:${String(
          d.getMinutes()
        ).padStart(2, "0")}`;
      },
    }),
    []
  );

  const onEdit = () => {
    // TODO: 打開你的「新增/編輯提醒」表單
    console.log("edit", current?.id);
  };

  const onDelete = async () => {
    if (!current) return;
    if (!window.confirm("確定要刪除這筆提醒嗎？")) return;
    try {
      await axios.delete(`http://localhost:3000/reminder/${current.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchData();
      setIsOpen(false);
    } catch (e) {
      console.error("刪除失敗", e);
      alert("刪除失敗");
    }
  };

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-slate-900">提醒事項</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="tm-primary-btn px-4 py-2.5 text-sm"
          >
            新增提醒事項
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center font-semibold text-slate-500">
            載入中…
          </div>
        ) : err ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
            {err}
          </div>
        ) : reminders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center font-semibold text-slate-500">
            目前沒有提醒事項
          </div>
        ) : (
          <>
            {/* 預覽卡片：一次只顯示一筆，左右切換 */}
            <div className="tm-panel grid min-h-[170px] grid-cols-[44px_1fr_44px] items-center gap-3 p-5">
              <button
                aria-label="上一筆"
                onClick={prev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-bold text-[#12345c] transition-colors hover:bg-slate-50"
              >
                ‹
              </button>

              <div
                className="cursor-pointer rounded-2xl p-4 transition-colors hover:bg-slate-50"
                onClick={() => setIsOpen(true)}
                aria-label="開啟詳細"
              >
                <div className="mb-1 flex items-center gap-2">
                  {current?.course_name ? (
                    <span className="tm-badge-success">
                      {current.course_name}
                    </span>
                  ) : null}
                </div>

                <div className="mb-1 line-clamp-1 text-xl font-extrabold text-slate-900">
                  {current?.title || "（未命名）"}
                </div>

                <div className="mb-2 text-sm font-semibold text-[#12345c]">
                  {fmt.date(current?.remind_at)} {fmt.time(current?.remind_at)}
                </div>

                <div className="line-clamp-2 leading-7 text-slate-600">
                  {current?.description || "（無內容）"}
                </div>
              </div>

              <button
                aria-label="下一筆"
                onClick={next}
                className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-2xl border border-slate-200 bg-white text-xl font-bold text-[#12345c] transition-colors hover:bg-slate-50"
              >
                ›
              </button>
            </div>

            {/* 指示點 */}
            <div className="mt-3 flex justify-center gap-1.5">
              {reminders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-7 bg-black"
                      : "w-2 bg-slate-200"
                  }`}
                  aria-label={`切換到第 ${i + 1} 筆`}
                />
              ))}
            </div>
          </>
        )}

        {/* 詳細彈窗 */}
        {isOpen && current && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="w-[min(92vw,720px)] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between bg-black px-5 py-4 text-white">
                <div className="text-lg font-extrabold">
                  {current.title || "（未命名）"}
                </div>
                <button
                  className="rounded-xl border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  關閉
                </button>
              </div>

              <div className="grid gap-3 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2 text-slate-600">
                  {current.course_name ? (
                    <span className="tm-badge-success">
                      {current.course_name}
                    </span>
                  ) : null}
                  <span className="text-sm">
                    \ud83d\udcc5 {fmt.date(current.remind_at)} \ud83d\udd52{" "}
                    {fmt.time(current.remind_at)}
                  </span>
                </div>

                <div className="whitespace-pre-wrap leading-7 text-slate-800">
                  {current.description || "（無內容）"}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
                <button
                  onClick={onEdit}
                  className="tm-secondary-btn px-4 py-2"
                >
                  編輯
                </button>
                <button
                  onClick={onDelete}
                  className="rounded-2xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
                >
                  刪除
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="tm-primary-btn px-4 py-2"
                >
                  確定
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showAdd && (
        <AddReminder
          onClose={() => {
            setShowAdd(false);
            fetchData(); // Refresh list after adding
          }}
          scheduleId={scheduleId}
        />
      )}
    </>
  );
}

export default Reminder;
