import React, { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { useParams } from "react-router-dom";
import AddReminder from "./AddReminder";
import ReminderCard from "./ReminderCard";
import ReminderDetailModal from "./ReminderDetailModal";
import { getApiErrorMessage } from "../api/axiosClient";
import { useReminders } from "../hooks/useReminders";

function Reminder() {
  const { scheduleId } = useParams();
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const {
    addReminder,
    error: err,
    loading,
    reminders,
    removeReminder,
  } = useReminders(scheduleId);

  const current = reminders[index] || null;

  useEffect(() => {
    setIndex(0);
  }, [reminders.length]);

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
      await removeReminder(current.id);
      setIsOpen(false);
      message.success("提醒刪除完成");
    } catch (e) {
      console.error("刪除失敗", e);
      message.error(getApiErrorMessage(e, "刪除失敗"));
    }
  };

  const handleCreateReminder = async (reminder) => {
    await addReminder(reminder);
    setShowAdd(false);
    message.success("提醒建立完成");
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
          <ReminderCard
            current={current}
            fmt={fmt}
            index={index}
            onNext={next}
            onOpen={() => setIsOpen(true)}
            onPrev={prev}
            onSelect={setIndex}
            reminders={reminders}
          />
        )}

        {/* 詳細彈窗 */}
        {isOpen && current && (
          <ReminderDetailModal
            current={current}
            fmt={fmt}
            onClose={() => setIsOpen(false)}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
      </div>
      {showAdd && (
        <AddReminder
          onClose={() => setShowAdd(false)}
          onCreate={handleCreateReminder}
          scheduleId={scheduleId}
        />
      )}
    </>
  );
}

export default Reminder;
