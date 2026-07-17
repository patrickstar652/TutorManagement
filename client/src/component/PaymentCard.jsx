import { FaCheck, FaUndo } from "react-icons/fa";

const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  currency: "TWD",
  maximumFractionDigits: 0,
  style: "currency",
});

const formatPaidAt = (value) => {
  if (!value) return "尚未繳費";

  return new Date(value).toLocaleString("zh-TW", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function PaymentCard({ disabled = false, payment, onToggle, updating }) {
  const isPaid = payment.status === "已繳";

  return (
    <article className="tm-card tm-card-hover flex flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-lg font-extrabold text-slate-900">
            {payment.student_name}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {isPaid ? `繳費時間：${formatPaidAt(payment.paid_at)}` : "等待繳費"}
          </p>
        </div>
        <span
          className={
            isPaid
              ? "tm-badge-success shrink-0"
              : "tm-badge-warning shrink-0"
          }
        >
          {payment.status}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            本期應繳
          </p>
          <p className="mt-1 text-xl font-extrabold text-slate-900">
            {currencyFormatter.format(Number(payment.amount_due) || 0)}
          </p>
        </div>
        <button
          className={
            isPaid
              ? "tm-secondary-btn px-4 py-2 text-sm"
              : "tm-primary-btn px-4 py-2 text-sm"
          }
          disabled={disabled || updating}
          onClick={() => onToggle(payment)}
          type="button"
        >
          {isPaid ? <FaUndo /> : <FaCheck />}
          {updating ? "更新中..." : isPaid ? "改回未繳" : "標記已繳"}
        </button>
      </div>
    </article>
  );
}

export default PaymentCard;
