import Navbar from "../component/Navbar";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Class() {
  const [classes, setClasses] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:3000/class", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClasses(res.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-6 py-6 gap-4 w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
          查詢班級
        </h1>
        <div className="h-1.5 w-40 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mb-4"></div>

        <div className="w-full bg-yellow-200 rounded-2xl shadow-lg p-6">
          <ul className="w-full space-y-6">
            {classes.map((item) => (
              <li key={item.course_id} className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <Link
                  className="flex items-center justify-between p-4 font-medium"
                   to={`/class/seat/${item.course_id}`}
                >
                  <div className="flex flex-col justify-center py-1 ml-2">
                    <span className="text-gray-900 text-lg font-bold mb-1">
                      {item.courseName}
                    </span>
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
    </>
  );
}

export default Class;
// <Outlet /> 共享畫面 & 父組件
