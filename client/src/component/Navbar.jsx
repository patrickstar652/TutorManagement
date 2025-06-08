import { Link } from "react-router-dom";
import { FaBook, FaSun, FaMoon } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Logout from "../pages/Logout";
import * as jwt_decode from "jwt-decode";
import { useState } from "react";

function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const token = localStorage.getItem("token");
  let user_info = jwt_decode.jwtDecode(token);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    Logout();
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <>
      <nav className="relative text-3xl bg-white text-blue-900 shadow-lg py-3 max-w-[80%] mx-auto rounded-xl">
        {/* <nav className="relative text-3xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg py-3"> */}
        <span className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <FaBook className="text-2xl text-yellow-300 hover:text-yellow-400 transition-colors" />
          <span className="font-semibold">炫揚文理</span>
        </span>
        <div className="flex justify-center gap-12 max-w-screen-xl mx-auto">
          <Link className="relative group text-blue-800 font-bold">
            <div className="flex items-center gap-1">
              <IoLogOutOutline className="text-2xl" />
              <span>首頁</span>
            </div>
            <span className="underline"></span>
          </Link>
          <Link className="relative group text-blue-800 font-bold">
            <div className="flex items-center gap-1">
              <IoLogOutOutline className="text-2xl" />
              <span>登入</span>
            </div>
            <span className="underline"></span>
          </Link>
          <Link
            className="relative group text-blue-800 font-bold"
            onClick={handleLogout}
          >
            {/* 調整登出 icon 和文字的排版 */}
            <div className="flex items-center gap-1">
              <IoLogOutOutline className="text-2xl" />
              <span>登出</span>
            </div>
            <span className="underline"></span>
          </Link>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-8">
          {/* 深淺色模式切換按鈕 */}
          <button
            onClick={toggleDarkMode}
            className={`w-14 h-7 rounded-full p-1 duration-700 ease-in-out flex items-center justify-between px-1 ${
              isDark ? "bg-gray-700" : "bg-amber-100"
            } hover:shadow-md`}
          >
            <FaSun
              className={`text-sm z-10 transition-all duration-700 ease-in-out ${
                isDark ? "opacity-50 rotate-90 text-gray-400" : "text-amber-400 scale-110"
              }`}
            />
            <FaMoon
              className={`text-sm z-10 transition-all duration-700 ease-in-out ${
                isDark ? "text-blue-200 scale-110" : "opacity-50 -rotate-90 text-amber-300"
              }`}
            />
            <div
              className={`w-5 h-5 rounded-full shadow-md transform duration-700 ease-in-out absolute ${
                isDark 
                  ? "translate-x-7 bg-gray-900" 
                  : "left-1 bg-white"
              }`}
            ></div>
          </button>

          {/* 使用者名稱 */}
          <span className="flex items-center gap-2 bg-orange-300 px-4 py-1 rounded-full text-lg text-white">
            {user_info.account}
          </span>
        </div>
      </nav>
    </>
  );
}
/*absolute 並根據最近的「定位父層」來定位。relative就是父層*/
export default Navbar;
