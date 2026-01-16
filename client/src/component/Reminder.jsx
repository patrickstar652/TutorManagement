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
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-800">提醒事項</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 px-4 py-2 text-white shadow hover:from-blue-600 hover:to-blue-500 active:scale-[.98]"
          >
            新增提醒事項
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            載入中…
          </div>
        ) : err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            {err}
          </div>
        ) : reminders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            目前沒有提醒事項
          </div>
        ) : (
          <>
            {/* 預覽卡片：一次只顯示一筆，左右切換 */}
            <div className="grid min-h-[150px] grid-cols-[48px_1fr_48px] items-center gap-3 rounded-2xl bg-white p-5 shadow-lg">
              <button
                aria-label="上一筆"
                onClick={prev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg hover:bg-slate-100"
              >
                ‹
              </button>

              <div
                className="cursor-pointer rounded-xl p-2 hover:bg-slate-50"
                onClick={() => setIsOpen(true)}
                aria-label="開啟詳細"
              >
                <div className="mb-1 flex items-center gap-2">
                  {current?.course_name ? (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                      {current.course_name}
                    </span>
                  ) : null}
                </div>

                <div className="mb-1 line-clamp-1 text-lg font-bold text-slate-800">
                  {current?.title || "（未命名）"}
                </div>

                <div className="mb-1 text-sm text-slate-500">
                  {fmt.date(current?.remind_at)} {fmt.time(current?.remind_at)}
                </div>

                <div className="line-clamp-2 text-slate-600">
                  {current?.description || "（無內容）"}
                </div>
              </div>

              <button
                aria-label="下一筆"
                onClick={next}
                className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-xl border border-slate-200 bg-slate-50 text-lg hover:bg-slate-100"
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
                      ? "w-6 bg-gradient-to-r from-orange-500 to-orange-400"
                      : "w-2 bg-slate-300"
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
            className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="w-[min(92vw,720px)] overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-4 text-white">
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
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
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
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  編輯
                </button>
                <button
                  onClick={onDelete}
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-rose-400 px-4 py-2 font-semibold text-white hover:from-rose-500/90 hover:to-rose-400/90"
                >
                  刪除
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 font-semibold text-white hover:from-orange-600 hover:to-orange-500"
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
