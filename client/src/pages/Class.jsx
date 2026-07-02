import Navbar from "../component/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Class() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/class", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data); // 期望欄位：class_id, schedule_id, course_name, weekday, start_time, end_time
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

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
            <ul className="w-full space-y-4">
              {classes.map((item) => (
                <li
                  key={item.schedule_id}
                  className="tm-card tm-card-hover overflow-hidden"
                >
                  <Link
                    className="flex items-center justify-between gap-4 p-5 font-medium"
                    to={`/class/seat/${item.schedule_id}`}  // ✅ 用 schedule_id
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-lg font-extrabold text-[#12345c] ring-1 ring-slate-200">
                        班
                      </div>
                      <div className="flex flex-col justify-center py-1">
                        <span className="mb-1 text-lg font-extrabold text-slate-900">
                          {item.course_name}                     {/* ✅ 用 course_name */}
                        </span>
                        {/* 想顯示時間可用：{item.weekday} {item.start_time?.slice(0,5)}~{item.end_time?.slice(0,5)} */}
                        <span className="text-sm font-medium text-slate-500">點選查看座位、提醒與繳費狀態</span>
                      </div>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-50 text-[#12345c] transition-colors">
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
