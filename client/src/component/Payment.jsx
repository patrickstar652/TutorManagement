import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import AddPayment from "./AddPayment";
import axios from "axios";
function Payment() {
  let { scheduleId } = useParams();
  scheduleId = parseInt(scheduleId);
  const [showUp, setShowUp] = useState(false);
  const [paymentlist, setPaymentlist] = useState([]);
  const [student, setStudent] = useState("");
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/payment/${scheduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      setPaymentlist(data);
    } catch (e) {
      console.error("取得繳費資訊失敗：", e);
      alert("取得繳費資訊失敗");
    }
  };
  useEffect(() => {
    if (scheduleId) {
      fetchData();
    }
  }, [scheduleId]);
  return (
    <>
      <div className="grid gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {paymentlist.map((payment, index) => (
          <div
            key={payment.id || index}
            className="tm-card tm-card-hover overflow-hidden"
          >
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
                        hour12: false, // 用 24 小時制，想要 AM/PM 改 true
                      })}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ring-1 ${
                    payment.status === "已繳"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                      : "bg-yellow-50 text-yellow-700 ring-yellow-100"
                  }`}>
                    {payment.status}
                  </span>
                  <button
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#12345c]"
                    title="更新繳費資訊"
                    onClick={() => {
                      setStudent(payment.student_name);
                      setShowUp(true);
                    }}
                  >
                    <FaEdit size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showUp && (
        <AddPayment
          onClose={() => setShowUp(false)}
          student={student}
          scheduleId={scheduleId}
        />
      )}
    </>
  );
}

export default Payment;
