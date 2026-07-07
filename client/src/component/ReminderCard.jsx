function ReminderCard({
  current,
  fmt,
  index,
  onNext,
  onOpen,
  onPrev,
  onSelect,
  reminders,
}) {
  return (
    <>
      <div className="tm-panel grid min-h-[170px] grid-cols-[44px_1fr_44px] items-center gap-3 p-5">
        <button
          aria-label="上一筆"
          onClick={onPrev}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-bold text-[#12345c] transition-colors hover:bg-slate-50"
        >
          ‹
        </button>

        <div
          className="cursor-pointer rounded-2xl p-4 transition-colors hover:bg-slate-50"
          onClick={onOpen}
          aria-label="開啟詳細"
        >
          <div className="mb-1 flex items-center gap-2">
            {current?.course_name ? (
              <span className="tm-badge-success">{current.course_name}</span>
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
          onClick={onNext}
          className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-2xl border border-slate-200 bg-white text-xl font-bold text-[#12345c] transition-colors hover:bg-slate-50"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {reminders.map((_, itemIndex) => (
          <button
            key={itemIndex}
            onClick={() => onSelect(itemIndex)}
            className={`h-2 rounded-full transition-all ${
              itemIndex === index ? "w-7 bg-black" : "w-2 bg-slate-200"
            }`}
            aria-label={`切換到第 ${itemIndex + 1} 筆`}
          />
        ))}
      </div>
    </>
  );
}

export default ReminderCard;
