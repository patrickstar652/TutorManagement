function ReminderDetailModal({ current, fmt, onClose, onDelete, onEdit }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[min(92vw,720px)] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-black px-5 py-4 text-white">
          <div className="text-lg font-extrabold">
            {current.title || "（未命名）"}
          </div>
          <button
            className="rounded-xl border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20"
            onClick={onClose}
            type="button"
          >
            關閉
          </button>
        </div>

        <div className="grid gap-3 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            {current.course_name ? (
              <span className="tm-badge-success">{current.course_name}</span>
            ) : null}
            <span className="text-sm">
              📅 {fmt.date(current.remind_at)} 🕒 {fmt.time(current.remind_at)}
            </span>
          </div>

          <div className="whitespace-pre-wrap leading-7 text-slate-800">
            {current.description || "（無內容）"}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button onClick={onEdit} className="tm-secondary-btn px-4 py-2">
            編輯
          </button>
          <button
            onClick={onDelete}
            className="rounded-2xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
            type="button"
          >
            刪除
          </button>
          <button onClick={onClose} className="tm-primary-btn px-4 py-2">
            確定
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReminderDetailModal;
