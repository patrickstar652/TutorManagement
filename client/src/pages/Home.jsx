import Navbar from "../component/Navbar";
import Carousel from "../component/Carousel";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaFacebook, FaInstagram, FaLine } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        return false;
      }
      return true;
    } catch {
      localStorage.removeItem("token");
      return false;
    }
  };

  const handleStartUsing = () => {
    if (checkAuth()) {
      navigate("/course");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="scroll-smooth bg-white text-gray-900">
      {/* 固定在最上方的導覽列 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <Navbar />
      </div>

      {/* Hero Section - 幾何與線條風格 */}
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20">
        {/* 背景裝飾 - 幾何圖形與網格 */}
        {/* 背景裝飾 - React 概念線條與科技幾何 */}
        {/* 背景裝飾 - 抽象科技線條 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 右上角：抽象連結網絡圖 */}
          <div className="absolute -top-[5%] -right-[5%] w-[700px] h-[700px] opacity-20">
            <svg viewBox="0 0 400 400" className="w-full h-full text-blue-600">
              <defs>
                <linearGradient
                  id="lineGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* 外圈裝飾環 */}
              <circle
                cx="200"
                cy="200"
                r="150"
                stroke="url(#lineGrad)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="10 10"
                className="animate-[spin_60s_linear_infinite]"
              />
              <circle
                cx="200"
                cy="200"
                r="120"
                stroke="#2563EB"
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />

              {/* 核心連結線條 */}
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M200 200 L320 120" opacity="0.6" />
                <path d="M200 200 L80 150" opacity="0.4" />
                <path d="M200 200 L250 320" opacity="0.5" />

                {/* 節點 */}
                <circle cx="200" cy="200" r="6" fill="#1E40AF" />
                <circle cx="320" cy="120" r="4" fill="#3B82F6" />
                <circle cx="80" cy="150" r="4" fill="#3B82F6" />
                <circle cx="250" cy="320" r="4" fill="#3B82F6" />
              </g>

              {/* 浮動粒子 */}
              <circle
                cx="150"
                cy="100"
                r="2"
                fill="#6366F1"
                className="animate-pulse"
              />
              <circle
                cx="300"
                cy="250"
                r="3"
                fill="#6366F1"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </svg>
          </div>

          {/* 左下角：粗獷的幾何結構 */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px] opacity-15">
            <svg viewBox="0 0 500 400" className="w-full h-full">
              <path
                d="M0 400 L150 250 L350 250 L500 100"
                stroke="#1E3A8A"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M50 400 L180 270"
                stroke="#2563EB"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5 5"
              />

              {/* 裝飾方塊 */}
              <rect
                x="140"
                y="240"
                width="20"
                height="20"
                fill="#1E40AF"
                transform="rotate(45 150 250)"
              />
              <rect
                x="340"
                y="240"
                width="20"
                height="20"
                fill="none"
                stroke="#1E40AF"
                strokeWidth="2"
                transform="rotate(45 350 250)"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* 左側：文字內容 */}
          <div className="text-left space-y-8">
            <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium tracking-wide">
              SMART SEATING SOLUTION
            </div>

            <h1 className="text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              座位管理
              <br />
              <span className="text-blue-600">簡單</span> 且{" "}
              <span className="text-indigo-600">高效</span>
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-lg border-l-4 border-blue-200 pl-6">
              專為教育機構設計的智能解決方案，讓繁瑣的座位安排變成一鍵完成的簡單任務。
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={handleStartUsing}
                className="px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-all hover:translate-x-1 flex items-center"
              >
                立即開始
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              <button className="px-8 py-4 border border-gray-200 text-gray-600 font-medium rounded-lg hover:border-gray-800 hover:text-gray-900 transition-all">
                了解更多
              </button>
            </div>
          </div>

          {/* 右側：功能展示區塊 */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl opacity-20 transform rotate-3"></div>
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-xl p-8 grid gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  🏫
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">課程管理</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    直觀的課程列表與時間安排，所有資訊一目了然。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border-l-4 border-blue-500 bg-blue-50/30">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  �
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">智能排座</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    拖曳式操作，支援多種排列模式，滿足不同教學需求。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  📊
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">即時同步</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    所有更改即時更新，確保所有助教與教師資訊一致。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部裝飾線 */}
        <div className="absolute bottom-0 left-0 w-full flex gap-1 h-2">
          <div className="w-1/4 bg-blue-600"></div>
          <div className="w-1/4 bg-indigo-600"></div>
          <div className="w-1/4 bg-purple-600"></div>
          <div className="w-1/4 bg-gray-200"></div>
        </div>
      </div>

      {/* 第二個區塊 - 簡約風格 */}
      <div className="py-32 bg-white relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 inline-block relative">
              更多功能特色
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
            </h2>
            <p className="text-gray-500 mt-4">
              持續進化的工具，為您帶來極致體驗
            </p>
          </div>

          <Carousel />

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="p-8 border border-gray-100 rounded-2xl hover:border-blue-200 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">數據分析</h3>
              <p className="text-gray-500">
                深入了解座位使用率與學生偏好，優化教室配置。
              </p>
            </div>

            <div className="p-8 border border-gray-100 rounded-2xl hover:border-indigo-200 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                全平台支援
              </h3>
              <p className="text-gray-500">
                無論是桌機、平板還是手機，隨時隨地都能管理。
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white text-gray-600 py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* 品牌區塊 */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 tracking-wide">
                炫揚文理
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                致力於提供最優質的教育環境與智能化的管理系統。讓學習更有效率，讓管理更加輕鬆。
              </p>
              <div className="flex gap-4 pt-2">
                {/* 社群圖標 */}
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer text-gray-600"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/kuosung2019?igsh=MW8wZ3ZrN281Z3VnOQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all cursor-pointer text-gray-600"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all cursor-pointer text-gray-600"
                >
                  <FaLine size={20} />
                </a>
              </div>
            </div>

            {/* 快速連結 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">快速連結</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    關於我們
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    課程介紹
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    師資團隊
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    最新消息
                  </a>
                </li>
              </ul>
            </div>

            {/* 聯絡資訊 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">聯絡我們</h4>
              <ul className="space-y-3 text-gray-500">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 mt-1 shrink-0 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">
                    台北市文山區羅斯福路171號7樓
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 shrink-0 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>(02) 2933-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 shrink-0 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>contact@demo.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} 炫揚文理. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">
                隱私權政策
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                服務條款
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                使用規範
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
