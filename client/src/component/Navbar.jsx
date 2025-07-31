import { Link, useLocation, NavLink } from "react-router-dom";
import { FaBook, FaSun, FaMoon } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Logout from "../pages/Logout";
import * as jwt_decode from "jwt-decode";
import { useState } from "react";

function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");

  // 安全地解碼 token
  let user_info = null;
  try {
    if (token && token !== "null" && token !== "undefined") {
      user_info = jwt_decode.jwtDecode(token);
    }
  } catch (error) {
    console.error("Token 解碼失敗:", error);
    // 清除無效的 token
    localStorage.removeItem("token");
  }

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    Logout();
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  // 根據當前路由決定導航連結的顏色
  const getLinkColor = ({ isActive }) => {
    if (isActive) {
      return "text-orange-600 font-bold"; // 當前頁面 - 橘色，無底線
    }
    return "text-blue-800 font-bold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"; // 其他頁面 - 藍色，hover 只有底線
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
          {user_info ? (
            <>
              <NavLink className={getLinkColor} to={"/class"}>
                <div className="flex items-center gap-1">
                  <IoLogOutOutline className="text-2xl" />
                  <span>班級</span>
                </div>
              </NavLink>
              
              <NavLink className={getLinkColor} to={"/course"}>
                <div className="flex items-center gap-1">
                  <IoLogOutOutline className="text-2xl" />
                  <span>課表</span>
                </div>
              </NavLink>

              <Link
                className="text-blue-800 font-bold transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                onClick={handleLogout}
              >
                {/* 調整登出 icon 和文字的排版 */}
                <div className="flex items-center gap-1">
                  <IoLogOutOutline className="text-2xl" />
                  <span>登出</span>
                </div>
              </Link>
            </>
          ):(<>
            <div className="flex items-center gap-1 text-white">
              <IoLogOutOutline className="text-2xl" />
              <span>課表</span>
            </div>
          </>
          )}
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
                isDark
                  ? "opacity-50 rotate-90 text-gray-400"
                  : "text-amber-400 scale-110"
              }`}
            />
            <FaMoon
              className={`text-sm z-10 transition-all duration-700 ease-in-out ${
                isDark
                  ? "text-blue-200 scale-110"
                  : "opacity-50 -rotate-90 text-amber-300"
              }`}
            />
            <div
              className={`w-5 h-5 rounded-full shadow-md transform duration-700 ease-in-out absolute ${
                isDark ? "translate-x-7 bg-gray-900" : "left-1 bg-white"
              }`}
            ></div>
          </button>

          {/* 使用者名稱 */}
          {user_info ? (
            <span className="flex items-center gap-2 bg-orange-300 px-4 py-1 rounded-full text-lg text-white">
              {user_info.account}
            </span>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-full text-lg text-white transition-colors"
            >
              登入
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
/*absolute 並根據最近的「定位父層」來定位。relative就是父層*/
export default Navbar;
