import { useState } from "react";

function AddPayment({
  initialAmount = "",
  initialStatus = "未繳",
  onClose,
  onSave,
  student,
}) {
  const [amount, setAmount] = useState(String(initialAmount ?? ""));
  const [status, setStatus] = useState(initialStatus || "未繳");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      if (onSave) {
        await onSave({ student, amount, status });
      }
    } catch (error) {
      console.error("更新繳費資料失敗：", error);
      alert("更新繳費資料失敗，請稍後再試");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_22px_54px_-28px_rgba(15,35,65,0.42)] ring-1 ring-slate-200/70 transition-all">
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-[#38bdf8]" />

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              更新繳費狀態
            </h2>
            <p className="mt-1 text-sm text-slate-500">{student}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                金額
              </label>
              <div className="group relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 transition-colors group-focus-within:text-[#12345c]">
                  $
                </span>
                <input
                  onChange={(event) => setAmount(event.target.value)}
                  value={amount}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="500"
                  className="tm-input pl-8"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                狀態
              </label>
              <select
                onChange={(event) => setStatus(event.target.value)}
                value={status}
                className="tm-input cursor-pointer"
              >
                <option value="未繳">未繳</option>
                <option value="已繳">已繳</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="tm-secondary-btn flex-1 px-4 py-3.5"
                type="button"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="tm-primary-btn flex-1 px-4 py-3.5"
                disabled={isSaving}
                type="button"
              >
                {isSaving ? "更新中..." : "儲存"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPayment;
