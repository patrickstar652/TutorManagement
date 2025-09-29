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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex justify-center">
        <div className="flex flex-col items-center mt-6 py-6 gap-4 w-full max-w-2xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
            查詢班級
          </h1>
          <div className="h-1.5 w-40 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mb-4"></div>

          <div className="w-full bg-yellow-200 rounded-2xl shadow-lg p-6">
            <ul className="w-full space-y-6">
              {classes.map((item) => (
                <li
                  key={item.schedule_id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Link
                    className="flex items-center justify-between p-4 font-medium"
                    to={`/class/seat/${item.schedule_id}`}  // ✅ 用 schedule_id
                  >
                    <div className="flex flex-col justify-center py-1 ml-2">
                      <span className="text-gray-900 text-lg font-bold mb-1">
                        {item.course_name}                     {/* ✅ 用 course_name */}
                      </span>
                      {/* 想顯示時間可用：{item.weekday} {item.start_time?.slice(0,5)}~{item.end_time?.slice(0,5)} */}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
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
