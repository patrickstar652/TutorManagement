import { FaEdit } from "react-icons/fa";

function PaymentCard({ payment, onEdit }) {
  const amount = Number(payment.amount ?? 0);
  const formattedAmount = new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);

  return (
    <div className="tm-card tm-card-hover overflow-hidden">
      <div className="border-b border-slate-200 bg-yellow-50/60 px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
          繳費狀態
        </h2>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition-colors hover:bg-slate-50">
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-slate-900">
              {payment.student_name}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {new Date(payment.created_at).toLocaleString("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700">
              <span className="text-xs font-extrabold text-slate-400">
                已繳金額
              </span>
              <span className="text-[#12345c]">{formattedAmount}</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-extrabold ring-1 ${
                payment.status === "已繳"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  : "bg-yellow-50 text-yellow-700 ring-yellow-100"
              }`}
            >
              {payment.status}
            </span>
            <button
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#12345c]"
              title="更新繳費資料"
              onClick={() => onEdit(payment)}
              type="button"
            >
              <FaEdit size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;
