import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { FaCalculator, FaTimes } from "react-icons/fa";
import { getApiErrorMessage } from "../api/axiosClient";

const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  currency: "TWD",
  maximumFractionDigits: 0,
  style: "currency",
});

const toDateInputValue = (value) => (value ? String(value).slice(0, 10) : "");

function BillingPeriodModal({ onClose, onSubmit, period = null, saving }) {
  const [form, setForm] = useState({
    lessonCount: period?.lesson_count ?? "",
    periodEnd: toDateInputValue(period?.period_end),
    periodStart: toDateInputValue(period?.period_start),
    unitPrice: period?.unit_price ?? "",
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const amountPerStudent = useMemo(() => {
    const lessonCount = Number(form.lessonCount);
    const unitPrice = Number(form.unitPrice);
    if (!Number.isFinite(lessonCount) || !Number.isFinite(unitPrice)) return 0;
    return lessonCount * unitPrice;
  }, [form.lessonCount, form.unitPrice]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.periodEnd < form.periodStart) {
      message.warning("結束日期不可早於開始日期");
      return;
    }

    try {
      await onSubmit({
        lessonCount: Number(form.lessonCount),
        periodEnd: form.periodEnd,
        periodStart: form.periodStart,
        unitPrice: Number(form.unitPrice),
      });
    } catch (error) {
      message.error(getApiErrorMessage(error, "儲存收費期別失敗，請稍後再試"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
        onClick={saving ? undefined : onClose}
      />

      <div
        aria-labelledby="billing-period-title"
        aria-modal="true"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,35,65,0.5)]"
        role="dialog"
      >
        <div className="h-1.5 bg-[#38bdf8]" />
        <form className="space-y-6 p-7 sm:p-8" onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">
                Billing period
              </p>
              <h2
                className="mt-1 text-2xl font-extrabold text-slate-900"
                id="billing-period-title"
              >
                {period ? "編輯收費期別" : "新增收費期別"}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                設定本期日期、實際堂數與全班共用單價。
              </p>
            </div>
            <button
              aria-label="關閉"
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              disabled={saving}
              onClick={onClose}
              type="button"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-slate-700">
              <span>開始日期</span>
              <input
                autoFocus
                className="tm-input"
                name="periodStart"
                onChange={handleChange}
                required
                type="date"
                value={form.periodStart}
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              <span>結束日期</span>
              <input
                className="tm-input"
                min={form.periodStart || undefined}
                name="periodEnd"
                onChange={handleChange}
                required
                type="date"
                value={form.periodEnd}
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              <span>實際堂數</span>
              <input
                className="tm-input"
                min="1"
                name="lessonCount"
                onChange={handleChange}
                required
                step="1"
                type="number"
                value={form.lessonCount}
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              <span>每堂單價</span>
              <input
                className="tm-input"
                min="0"
                name="unitPrice"
                onChange={handleChange}
                required
                step="1"
                type="number"
                value={form.unitPrice}
              />
            </label>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
            <span className="rounded-2xl bg-white p-3 text-sky-600 shadow-sm">
              <FaCalculator />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                每位學生本期應繳
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {currencyFormatter.format(amountPerStudent || 0)}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {Number(form.lessonCount) || 0} 堂 × {" "}
                {currencyFormatter.format(Number(form.unitPrice) || 0)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              className="tm-secondary-btn flex-1"
              disabled={saving}
              onClick={onClose}
              type="button"
            >
              取消
            </button>
            <button
              className="tm-primary-btn flex-1"
              disabled={saving}
              type="submit"
            >
              {saving ? "儲存中..." : period ? "儲存修改" : "建立期別"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BillingPeriodModal;
