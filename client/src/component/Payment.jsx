import { useState } from "react";
import { useParams } from "react-router-dom";
import AddPayment from "./AddPayment";
import PaymentCard from "./PaymentCard";
import { getApiErrorMessage } from "../api/axiosClient";
import { usePayments } from "../hooks/usePayments";

function Payment() {
  const { scheduleId: scheduleIdParam } = useParams();
  const scheduleId = Number(scheduleIdParam);
  const [showUp, setShowUp] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { error, loading, payments, savePayment } = usePayments(scheduleId);

  const handleSavePayment = async (payment) => {
    try {
      await savePayment(payment);
      setShowUp(false);
    } catch (error) {
      alert(getApiErrorMessage(error, "更新繳費資料失敗，請稍後再試"));
    }
  };

  return (
    <>
      {loading && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center font-semibold text-slate-500">
          載入繳費資料中...
        </div>
      )}
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}
      <div className="grid gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {payments.map((payment, index) => (
          <PaymentCard
            key={payment.id || payment.class_member_id || index}
            onEdit={(payment) => {
              setSelectedPayment(payment);
              setShowUp(true);
            }}
            payment={payment}
          />
        ))}
      </div>
      {showUp && (
        <AddPayment
          initialAmount={selectedPayment?.amount ?? ""}
          initialStatus={selectedPayment?.status || "未繳"}
          onClose={() => {
            setShowUp(false);
            setSelectedPayment(null);
          }}
          onSave={handleSavePayment}
          student={selectedPayment?.student_name || ""}
        />
      )}
    </>
  );
}

export default Payment;
