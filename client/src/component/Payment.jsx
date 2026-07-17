import { useCallback, useState } from "react";
import { message } from "antd";
import {
  FaCalendarAlt,
  FaCoins,
  FaExclamationCircle,
  FaPen,
  FaPlus,
  FaUsers,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import BillingPeriodModal from "./BillingPeriodModal";
import PaymentCard from "./PaymentCard";
import { getApiErrorMessage } from "../api/axiosClient";
import { usePayments } from "../hooks/usePayments";

const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  currency: "TWD",
  maximumFractionDigits: 0,
  style: "currency",
});

const formatDate = (value) => {
  if (!value) return "--";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  return `${year}/${month}/${day}`;
};

function SummaryCard({ accent, icon, label, value }) {
  return (
    <div className="tm-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
        </div>
        <span className={`rounded-2xl p-3 text-lg ${accent}`}>{icon}</span>
      </div>
    </div>
  );
}

function Payment() {
  const { scheduleId: scheduleIdParam } = useParams();
  const scheduleId = Number(scheduleIdParam);
  const [periodModalMode, setPeriodModalMode] = useState(null);
  const {
    createPeriod,
    currentPeriod,
    editPeriod,
    error,
    loading,
    payments,
    periods,
    refresh,
    savingPeriod,
    selectedPeriodId,
    selectPeriod,
    setPaymentStatus,
    summary,
    updatingPaymentId,
  } = usePayments(scheduleId);

  const closePeriodModal = useCallback(() => setPeriodModalMode(null), []);

  const handleSavePeriod = async (period) => {
    if (periodModalMode === "edit") {
      await editPeriod({ periodId: currentPeriod.id, ...period });
      message.success("收費期別已更新");
    } else {
      await createPeriod(period);
      message.success("收費期別已建立");
    }
    closePeriodModal();
  };

  const handleTogglePayment = async (payment) => {
    const nextStatus = payment.status === "已繳" ? "未繳" : "已繳";
    try {
      await setPaymentStatus({ paymentId: payment.id, status: nextStatus });
      message.success(`${payment.student_name} 已更新為${nextStatus}`);
    } catch (error) {
      message.error(getApiErrorMessage(error, "更新繳費狀態失敗，請稍後再試"));
    }
  };

  const periodSelectValue = selectedPeriodId || currentPeriod?.id || "";
  const paymentUpdating = updatingPaymentId !== null;
  const switchingPeriod =
    periods.length > 0 &&
    (loading ||
      currentPeriod?.schedule_id !== scheduleId ||
      (selectedPeriodId !== null && currentPeriod?.id !== selectedPeriodId));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-sky-600">兩個月收費管理</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            繳費總覽
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            依堂數與單價建立期別，學生只需更新繳費狀態。
          </p>
        </div>
        <button
          className="tm-primary-btn px-4 py-2.5 text-sm"
          disabled={
            loading || paymentUpdating || savingPeriod || switchingPeriod
          }
          onClick={() => setPeriodModalMode("create")}
          type="button"
        >
          <FaPlus />
          新增收費期別
        </button>
      </div>

      {loading && periods.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center font-semibold text-slate-500">
          載入繳費資料中...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">{error}</p>
          <button
            className="tm-secondary-btn mt-4 px-4 py-2 text-sm"
            onClick={() => refresh().catch(() => {})}
            type="button"
          >
            重新載入
          </button>
        </div>
      ) : periods.length === 0 ? (
        <div className="tm-panel px-6 py-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-xl text-sky-600">
            <FaCalendarAlt />
          </span>
          <h3 className="mt-5 text-xl font-extrabold text-slate-900">
            尚未建立收費期別
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
            先設定日期、實際堂數與每堂單價，系統會替目前班級名單建立固定應繳金額。
          </p>
          <button
            className="tm-primary-btn mt-6 px-5 py-2.5 text-sm"
            onClick={() => setPeriodModalMode("create")}
            type="button"
          >
            <FaPlus />
            建立第一個期別
          </button>
        </div>
      ) : (
        <>
          <section className="tm-panel p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <label className="w-full max-w-sm space-y-2 text-sm font-bold text-slate-700">
                <span>查看收費期別</span>
                <select
                  className="tm-input cursor-pointer"
                  disabled={
                    loading || paymentUpdating || savingPeriod || switchingPeriod
                  }
                  onChange={(event) => selectPeriod(event.target.value)}
                  value={periodSelectValue}
                >
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {formatDate(period.period_start)}－
                      {formatDate(period.period_end)}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="tm-secondary-btn px-4 py-2.5 text-sm"
                disabled={
                  !currentPeriod?.can_edit ||
                  loading ||
                  paymentUpdating ||
                  savingPeriod ||
                  switchingPeriod
                }
                onClick={() => setPeriodModalMode("edit")}
                title={
                  currentPeriod?.can_edit
                    ? "編輯目前期別"
                    : "已有學生繳費，無法修改期別計價"
                }
                type="button"
              >
                <FaPen />
                編輯期別
              </button>
            </div>

            {currentPeriod && !switchingPeriod && (
              <div className="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="font-bold text-slate-400">日期</p>
                  <p className="mt-1 font-extrabold text-slate-700">
                    {formatDate(currentPeriod.period_start)}－
                    {formatDate(currentPeriod.period_end)}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-400">實際堂數</p>
                  <p className="mt-1 font-extrabold text-slate-700">
                    {currentPeriod.lesson_count} 堂
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-400">每堂單價</p>
                  <p className="mt-1 font-extrabold text-slate-700">
                    {currencyFormatter.format(currentPeriod.unit_price)}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-400">每人應繳</p>
                  <p className="mt-1 font-extrabold text-slate-700">
                    {currencyFormatter.format(currentPeriod.amount_per_student)}
                  </p>
                </div>
              </div>
            )}
          </section>

          {switchingPeriod ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center font-semibold text-slate-500">
              載入所選期別中...
            </div>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                  accent="bg-sky-50 text-sky-600"
                  icon={<FaCoins />}
                  label="本期總應收"
                  value={currencyFormatter.format(summary.total_due)}
                />
                <SummaryCard
                  accent="bg-emerald-50 text-emerald-600"
                  icon={<FaCoins />}
                  label="目前已收"
                  value={currencyFormatter.format(summary.total_collected)}
                />
                <SummaryCard
                  accent="bg-amber-50 text-amber-600"
                  icon={<FaExclamationCircle />}
                  label="尚未收款"
                  value={currencyFormatter.format(summary.total_outstanding)}
                />
                <SummaryCard
                  accent="bg-violet-50 text-violet-600"
                  icon={<FaUsers />}
                  label="繳費人數"
                  value={`${summary.paid_count} 已繳／${summary.unpaid_count} 未繳`}
                />
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    學生繳費明細
                  </h3>
                  <span className="tm-badge">
                    共 {summary.total_students} 人
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {payments.map((payment) => (
                    <PaymentCard
                      disabled={
                        loading ||
                        paymentUpdating ||
                        savingPeriod ||
                        switchingPeriod
                      }
                      key={payment.id}
                      onToggle={handleTogglePayment}
                      payment={payment}
                      updating={updatingPaymentId === payment.id}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}

      {periodModalMode && (
        <BillingPeriodModal
          onClose={closePeriodModal}
          onSubmit={handleSavePeriod}
          period={periodModalMode === "edit" ? currentPeriod : null}
          saving={savingPeriod}
        />
      )}
    </div>
  );
}

export default Payment;
