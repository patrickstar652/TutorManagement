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
      <div className="flex flex-wrap justify-center gap-6 p-8">
        {paymentlist.map((payment, index) => (
          <div
            key={payment.id || index}
            className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                繳費狀態
              </h2>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      {payment.student_name}
                    </p>
                    <p className="text-sm text-gray-500">
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
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold shadow-sm border border-green-200">
                    {payment.status}
                  </span>
                  <button
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
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
