import Navbar from "../component/Navbar";
import { Link, Outlet } from "react-router-dom";

function Class() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-6 py-6 gap-4 w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent mb-2">
          查詢班級
        </h1>
        <div className="h-1.5 w-40 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mb-4"></div>

        <div className="w-full bg-yellow-200  rounded-2xl shadow-lg p-6">
          <ul className="w-full space-y-6">
            {/* 化學課程 */}
            <li className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <Link
                className="flex items-center justify-between p-4 font-medium"
                to="/class/seat"
              >
                <div className="flex flex-col justify-center py-1 ml-2">
                  <span className="text-gray-900 text-lg font-bold mb-1">
                    高二化學
                  </span>
                  <span className="text-gray-600 text-sm">
                    週一 13:30-15:30
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    32人
                  </span>
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

            {/* 數學課程 */}
            <li className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <Link
                className="flex items-center justify-between p-4 font-medium"
                to="/class/seat"
              >
                <div className="flex flex-col justify-center py-1 ml-2">
                  <span className="text-gray-900 text-lg font-bold mb-1">
                    國三數學
                  </span>
                  <span className="text-gray-600 text-sm">
                    週三 15:40-17:40
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    28人
                  </span>
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

            {/* 英文課程 */}
            <li className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <Link
                className="flex items-center justify-between p-4 font-medium"
                to="/class/seat"
              >
                <div className="flex flex-col justify-center py-1 ml-2">
                  <span className="text-gray-900 text-lg font-bold mb-1">
                    高一英文
                  </span>
                  <span className="text-gray-600 text-sm">
                    週五 09:00-11:00
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    35人
                  </span>
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
          </ul>
        </div>
      </div>
    </>
  );
}
export default Class;
// <Outlet /> 共享畫面 & 父組件
