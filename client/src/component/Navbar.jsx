import { Link, NavLink } from "react-router-dom";
import { FaBook, FaSun, FaMoon } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { School, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

function Navbar() {
  const [isDark, setIsDark] = useState(() => {
    return window.localStorage.getItem("theme") === "dark";
  });
  const { logout, user } = useAuth();

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", isDark);
    document.body.classList.toggle("theme-dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // 根據當前路由決定導航連結的顏色
  const getLinkColor = ({ isActive }) => {
    if (isActive) {
      return "inline-flex items-center gap-2 rounded-full bg-[#12345c] px-3.5 py-2 text-sm font-bold text-white shadow-sm border border-[#12345c]"; // 當前頁面 - 橘色，無底線
    }
    return "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-[#12345c]"; // 其他頁面 - 藍色，hover 只有底線
  };

  return (
    <>
      <nav className="relative mx-auto mt-3 flex w-[min(1180px,calc(100%-2rem))] items-center justify-between rounded-3xl border border-slate-200 bg-white/92 px-4 py-2.5 text-slate-800 shadow-[0_18px_44px_-32px_rgba(15,35,65,0.35)] backdrop-blur-xl md:px-5">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5"
        >
          <svg
            className="h-9 w-auto rounded-2xl border border-slate-200 bg-slate-50"
            viewBox="0 0 600 350"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <color id="skin" value="#f3d4b7" />
              <color id="hair" value="#4a3223" />
              <color id="glasses-gold" value="#e0a800" />
              <color id="glasses-dark" value="#2c3e50" />
              <color id="suit-blue" value="#111111" />
              <color id="tie-red" value="#c0392b" />
              <color id="shirt-white" value="#ffffff" />
              <color id="vest-grey" value="#7f8c8d" />
              <color id="desk-wood" value="#cba27a" />

            </defs>

            <rect width="600" height="350" fill="#f8fafc" />
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
                fill="#111111"
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
                  stroke="#111111"
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
              <rect x="0" y="0" width="75" height="20" fill="#111111" />
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
          <span className="hidden whitespace-nowrap text-lg font-extrabold tracking-wide text-[#0b2545] sm:inline">
            炫揚文理
          </span>
        </Link>
        <div className="flex flex-1 justify-center gap-1 sm:gap-2">
          {user ? (
            <>
              <NavLink className={getLinkColor} to={"/class"}>
                <div className="flex items-center gap-1.5">
                  <School className="h-4 w-4" />
                  <span>班級</span>
                </div>
              </NavLink>

              <NavLink className={getLinkColor} to={"/course"}>
                <div className="flex items-center gap-1.5">
                  <CalendarCheck className="h-4 w-4" />
                  <span>課表</span>
                </div>
              </NavLink>

              <Link
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                onClick={handleLogout}
              >
                {/* 調整登出 icon 和文字的排版 */}
                <div className="flex items-center gap-1.5">
                  <IoLogOutOutline className="text-lg" />
                  <span>登出</span>
                </div>
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1 text-transparent">
                <IoLogOutOutline className="text-lg" />
                <span>課表</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 深淺色模式切換按鈕 */}
          <button
            onClick={toggleDarkMode}
            type="button"
            aria-label={isDark ? "切換為淺色模式" : "切換為深色模式"}
            aria-pressed={isDark}
            className={`relative flex h-7 w-14 items-center justify-between rounded-full px-1 duration-700 ease-in-out ${
              isDark ? "bg-gray-700" : "bg-slate-100"
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
                  ? "text-yellow-100 scale-110"
                : "opacity-50 -rotate-90 text-slate-400"
              }`}
            />
            <div
              className={`w-5 h-5 rounded-full shadow-md transform duration-700 ease-in-out absolute ${
                isDark ? "translate-x-7 bg-gray-900" : "left-1 bg-white"
              }`}
            ></div>
          </button>

          {/* 使用者名稱 */}
          {user ? (
            <span className="hidden items-center gap-2 rounded-full bg-slate-50 px-3.5 py-2 text-sm font-bold text-[#12345c] ring-1 ring-slate-200 md:flex">
              {user.account}
            </span>
          ) : (
            <Link
              to="/login"
              className="tm-primary-btn px-4 py-2 text-sm"
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
