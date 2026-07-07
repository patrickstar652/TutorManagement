const seatRows = Array.from({ length: 5 }, (_, rowIndex) => {
  const row = rowIndex + 1;
  return [
    [`L${row}-1`, `L${row}-2`, `L${row}-3`],
    [`R${row}-1`, `R${row}-2`, `R${row}-3`],
  ];
});

function SeatGrid({ loading, error, onSeatClick, seatMap }) {
  const getSeatName = (seatId) => seatMap[seatId] || "-";
  const isSeatOccupied = (seatId) =>
    seatMap[seatId] && seatMap[seatId].trim() !== "";

  const renderSeat = (seatId) => (
    <div
      key={seatId}
      onClick={() => onSeatClick(seatId)}
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

  return (
    <div className="tm-panel p-5 sm:p-8">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-900">
        教室座位表
      </h2>

      <div className="mx-auto mb-10 flex h-12 w-full max-w-xl items-center justify-center rounded-[1.25rem] bg-black text-center font-extrabold text-white shadow-[0_16px_28px_-22px_rgba(0,0,0,0.55)]">
        講台
      </div>
      {loading && (
        <div className="mb-4 text-center font-semibold text-slate-500">
          載入座位中...
        </div>
      )}
      {error && (
        <div className="mb-4 text-center font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mx-auto mb-8 max-w-4xl overflow-x-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)]">
        {seatRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="mb-5 flex min-w-[520px] justify-center gap-12 sm:gap-16"
          >
            {row.map((section, sectionIndex) => (
              <div key={sectionIndex} className="flex gap-1">
                {section.map(renderSeat)}
              </div>
            ))}
          </div>
        ))}
      </div>

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
  );
}

export default SeatGrid;
