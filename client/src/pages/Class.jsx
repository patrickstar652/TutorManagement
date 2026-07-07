import Navbar from "../component/Navbar";
import { Link } from "react-router-dom";
import { useClasses } from "../hooks/useClasses";

function Class() {
  const { classes, error, loading } = useClasses();

  return (
    <div className="tm-page">
      <Navbar />
      <div className="tm-shell py-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
          <span className="tm-section-kicker">班級總覽</span>
          <h1 className="tm-section-title">
            查詢班級
          </h1>
          <div className="tm-title-underline mb-4"></div>

          <div className="tm-panel w-full p-4 sm:p-6">
            {loading && (
              <div className="p-6 text-center font-semibold text-slate-500">
                載入班級中...
              </div>
            )}
            {error && (
              <div className="p-6 text-center font-semibold text-red-600">
                {error}
              </div>
            )}
            <ul className="w-full space-y-4">
              {classes.map((item) => (
                <li
                  key={item.schedule_id}
                  className="tm-card tm-card-hover overflow-hidden"
                >
                  <Link
                    className="flex items-center justify-between gap-4 p-5 font-medium"
                    to={`/class/seat/${item.schedule_id}`}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-lg font-extrabold text-[#12345c] ring-1 ring-slate-200">
                        班
                      </div>
                      <div className="flex min-w-0 flex-col justify-center py-1">
                        <span className="mb-1 truncate text-lg font-extrabold text-slate-900">
                          {item.course_name}
                        </span>
                        <span className="text-sm font-medium text-slate-500">
                          點選查看座位、提醒與繳費狀態
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="hidden items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/80 px-3 py-2 text-[#12345c] shadow-[0_10px_24px_-18px_rgba(14,116,144,0.65),inset_0_1px_0_rgba(255,255,255,0.9)] sm:flex">
                        <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-white px-2 text-xl font-black leading-none tabular-nums ring-1 ring-sky-100">
                          {item.student_count ?? 0}
                        </span>
                        <span className="flex flex-col leading-none">
                          <span className="text-[11px] font-extrabold text-slate-500">
                            學生人數
                          </span>
                          <span className="mt-1 text-xs font-black">
                            位學生
                          </span>
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-black text-[#12345c] shadow-sm sm:hidden">
                        <span className="tabular-nums">{item.student_count ?? 0}</span>
                        <span>人</span>
                      </div>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50 text-[#12345c] transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Class;
