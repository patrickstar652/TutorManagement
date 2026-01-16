import { Link, useLocation, NavLink } from "react-router-dom";
import { FaBook, FaSun, FaMoon } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { School, CalendarCheck } from "lucide-react";
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
        <Link
          to="/"
          className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3"
        >
          <svg
            className="h-12 w-auto"
            viewBox="0 0 600 350"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <color id="skin" value="#f3d4b7" />
              <color id="hair" value="#4a3223" />
              <color id="glasses-gold" value="#e0a800" />
              <color id="glasses-dark" value="#2c3e50" />
              <color id="suit-blue" value="#1c3f73" />
              <color id="tie-red" value="#c0392b" />
              <color id="shirt-white" value="#ffffff" />
              <color id="vest-grey" value="#7f8c8d" />
              <color id="desk-wood" value="#cba27a" />

              <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#eef2f7" />
                <stop offset="100%" stopColor="#dbe4f0" />
              </linearGradient>
            </defs>

            <rect width="600" height="350" fill="url(#bgGradient)" />
            <rect
              x="50"
              y="50"
              width="500"
              height="180"
              rx="10"
              fill="#ffffff"
              stroke="#d0d8e8"
              strokeWidth="2"
              opacity="0.5"
            />
            <rect x="0" y="280" width="600" height="70" fill="#cba27a" />
            <rect x="0" y="280" width="600" height="10" fill="#b08d69" />

            <g transform="translate(130, 280)">
              <path
                d="M-85,0 L-75,-120 C-75,-120 -40,-145 0,-145 C40,-145 75,-120 75,-120 L85,0 Z"
                fill="#1c3f73"
              />
              <path d="M-30,-145 L0,-110 L30,-145 L0,-135 Z" fill="#ffffff" />
              <path d="M0,-110 L-10,-135 L10,-135 Z" fill="#c0392b" />
              <path d="M-8,-110 L8,-110 L12,0 H-12 Z" fill="#c0392b" />
              <g transform="translate(0, -170)">
                <circle cx="0" cy="0" r="50" fill="#f3d4b7" />
                <path
                  d="M50,-10 C50,-50 20,-65 0,-65 C-30,-65 -50,-45 -50,-15 C-50,0 -45,10 -45,10 L0,-20 L45,10 C45,10 50,10 50,-10 Z"
                  fill="#4a3223"
                />
                <g stroke="#e0a800" strokeWidth="3" fill="none">
                  <circle cx="-22" cy="5" r="16" />
                  <circle cx="22" cy="5" r="16" />
                  <line x1="-6" y1="5" x2="6" y2="5" />
                </g>
                <path
                  d="M-15,35 Q0,45 15,35"
                  stroke="#c07e53"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
              </g>
              <g transform="translate(20, 20)">
                <path d="M40,-80 L90,-60 L100,-40 L60,-50 Z" fill="#f3d4b7" />
                <path
                  d="M40,-80 L90,-60"
                  stroke="#1c3f73"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </g>
            </g>

            <g transform="translate(440, 280)">
              <path
                d="M-80,0 L-75,-120 C-75,-120 -40,-145 0,-145 C40,-145 75,-120 75,-120 L80,0 Z"
                fill="#ffffff"
              />
              <path
                d="M-75,-120 L-60,0 H60 L75,-120 C40,-145 -40,-145 -75,-120 Z"
                fill="#7f8c8d"
              />
              <g transform="translate(0, -175)">
                <circle cx="0" cy="0" r="52" fill="#f3d4b7" />
                <path
                  d="M-52,-10 C-52,-50 -20,-65 0,-65 C30,-65 52,-45 52,-15 C52,0 45,10 45,10 L0,-20 L-45,10 C-45,10 -52,10 -52,-10 Z"
                  fill="#4a3223"
                />
                <g stroke="#2c3e50" strokeWidth="3" fill="none">
                  <rect x="-38" y="-8" width="34" height="24" rx="5" />
                  <rect x="4" y="-8" width="34" height="24" rx="5" />
                  <line x1="-4" y1="4" x2="4" y2="4" />
                </g>
                <path
                  d="M-18,35 Q0,42 18,35"
                  stroke="#c07e53"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
              </g>
              <path d="M-50,0 C-60,-15 -40,-25 -20,0 Z" fill="#f3d4b7" />
              <path d="M50,0 C60,-15 40,-25 20,0 Z" fill="#f3d4b7" />
            </g>

            <g transform="translate(250, 245)">
              <rect x="0" y="20" width="80" height="15" fill="#c0392b" />
              <rect
                x="5"
                y="25"
                width="70"
                height="3"
                fill="#ffffff"
                opacity="0.5"
              />
              <rect x="0" y="0" width="75" height="20" fill="#2980b9" />
              <rect
                x="5"
                y="5"
                width="65"
                height="3"
                fill="#ffffff"
                opacity="0.5"
              />
              <text
                x="10"
                y="15"
                fontFamily="Arial"
                fontWeight="bold"
                fontSize="10"
                fill="white"
              >
                MATH
              </text>
              <g transform="translate(100, -10) rotate(10)">
                <rect
                  x="0"
                  y="0"
                  width="70"
                  height="50"
                  rx="5"
                  fill="#333333"
                />
                <rect x="4" y="4" width="62" height="42" fill="#aed6f1" />
                <path
                  d="M10,40 L20,30 L30,35 L40,20 L50,25 L60,10"
                  stroke="#e74c3c"
                  strokeWidth="2"
                  fill="none"
                />
              </g>
            </g>
          </svg>
          <span className="font-semibold text-2xl tracking-wide text-blue-900">
            炫揚文理
          </span>
        </Link>
        <div className="flex justify-center gap-12 max-w-screen-xl mx-auto">
          {user_info ? (
            <>
              <NavLink className={getLinkColor} to={"/class"}>
                <div className="flex items-center gap-1">
                  <School className="text-2xl" />
                  <span>班級</span>
                </div>
              </NavLink>

              <NavLink className={getLinkColor} to={"/course"}>
                <div className="flex items-center gap-1">
                  <CalendarCheck className="text-2xl" />
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
          ) : (
            <>
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
