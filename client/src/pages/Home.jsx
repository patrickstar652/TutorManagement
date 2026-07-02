import Navbar from "../component/Navbar";
import Carousel from "../component/Carousel";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaFacebook, FaInstagram, FaLine } from "react-icons/fa";
import { Headphones, Repeat } from "lucide-react";

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
    <div className="tm-page scroll-smooth">
      {/* 固定在最上方的導覽列 */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Hero Section - 幾何與線條風格 */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-12 pt-28">
        {/* 背景裝飾 - 幾何圖形與網格 */}
        {/* 背景裝飾 - React 概念線條與科技幾何 */}
        {/* 背景裝飾 - 抽象科技線條 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 右上角：抽象連結網絡圖 */}
          <div className="absolute -right-[9%] top-[3%] h-[620px] w-[620px] opacity-30">
            <svg viewBox="0 0 400 400" className="h-full w-full text-[#12345c]">
              {/* 外圈裝飾環 */}
              <circle
                cx="200"
                cy="200"
                r="150"
                stroke="#111111"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="10 10"
                className="animate-[spin_60s_linear_infinite]"
              />
              <circle
                cx="200"
                cy="200"
                r="120"
                stroke="#F97316"
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
                <circle cx="200" cy="200" r="6" fill="#F97316" />
                <circle cx="320" cy="120" r="4" fill="#12345C" />
                <circle cx="80" cy="150" r="4" fill="#12345C" />
                <circle cx="250" cy="320" r="4" fill="#12345C" />
              </g>

              {/* 浮動粒子 */}
              <circle
                cx="150"
                cy="100"
                r="2"
                fill="#F97316"
                className="animate-pulse"
              />
              <circle
                cx="300"
                cy="250"
                r="3"
                fill="#FACC15"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </svg>
          </div>

          {/* 左下角：粗獷的幾何結構 */}
          <div className="absolute bottom-4 left-0 h-[360px] w-[460px] opacity-20">
            <svg viewBox="0 0 500 400" className="w-full h-full">
              <path
                d="M0 400 L150 250 L350 250 L500 100"
                stroke="#12345C"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M50 400 L180 270"
                stroke="#F97316"
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
                fill="#FACC15"
                transform="rotate(45 150 250)"
              />
              <rect
                x="340"
                y="240"
                width="20"
                height="20"
                fill="none"
                stroke="#12345C"
                strokeWidth="2"
                transform="rotate(45 350 250)"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.04fr_0.96fr]">
          {/* 左側：文字內容 */}
          <div className="space-y-7 text-left">
            <div className="tm-section-kicker">
              小郭老師、宋老師
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              炫揚文理
              <br />
              <span className="text-[#12345c]">全心</span> 且{" "}
              <span className="text-[#f97316]">為你</span>
            </h1>

            <p className="max-w-xl border-l-4 border-[#f97316]/40 pl-5 text-lg leading-8 text-slate-600 sm:text-xl">
              付出100%的教學熱忱，只為讓學生獲得努力後的回報。
            </p>

            <div className="flex flex-wrap gap-2.5 text-sm font-bold">
              <span className="tm-badge">座位管理</span>
              <span className="tm-badge-success">課表追蹤</span>
              <span className="tm-badge-warning">繳費提醒</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleStartUsing}
                className="tm-primary-btn"
              >
                立即開始
                <svg
                  className="h-5 w-5"
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
              <button className="tm-secondary-btn">
                了解更多
              </button>
            </div>
          </div>

          {/* 右側：功能展示區塊 */}
          <div className="relative">
            <div className="absolute -inset-4 rotate-2 rounded-[2rem] bg-yellow-50 opacity-80"></div>
            <div className="tm-panel relative grid gap-4 p-5 sm:p-7">
              <div className="flex items-start gap-4 rounded-2xl bg-white/72 p-4 transition-colors hover:bg-white">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-[#12345c] ring-1 ring-slate-200">
                  <Headphones size={30} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">自習區</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    教室外設有獨立自習區域，提供舒適的學習環境。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:bg-white">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#12345c] shadow-sm ring-1 ring-slate-200">
                  <Repeat size={30} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">解題老師</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    可以隨時詢問解題問題，不須額外收費。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-yellow-50/80 p-4 transition-colors hover:bg-yellow-50">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#f97316] shadow-sm">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h8M9 17H5a2 2 0 01-2-2V7a2 2 0 012-2h4m0 12h10a2 2 0 002-2v-3M9 5h10a2 2 0 012 2v1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">即時同步</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    所有更改即時更新，確保所有助教與教師資訊一致。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部裝飾線 */}
        <div className="absolute bottom-0 left-0 flex h-2 w-full gap-1">
          <div className="w-1/4 bg-[#12345c]"></div>
          <div className="w-1/4 bg-[#f97316]"></div>
          <div className="w-1/4 bg-[#facc15]"></div>
          <div className="w-1/4 bg-slate-100"></div>
        </div>
      </div>

      {/* 第二個區塊 - 簡約風格 */}
      <div className="relative bg-white/50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="tm-section-title relative inline-block">
              教室環境
              <div className="absolute -bottom-3 left-0 h-1 w-full rounded-full bg-[#dc2626]"></div>
            </h2>
            <p className="mt-5 text-slate-600">
              打造一個適合讀書的舒適環境
            </p>
          </div>

          <Carousel />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="tm-card tm-card-hover p-7 group">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#12345c] transition-colors group-hover:bg-[#12345c] group-hover:text-white">
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
              <h3 className="mb-2 text-xl font-extrabold text-slate-900">數據分析</h3>
              <p className="leading-7 text-slate-600">
                深入了解座位使用率與學生偏好，優化教室配置。
              </p>
            </div>

            <div className="tm-card tm-card-hover p-7 group">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-[#f97316] transition-colors group-hover:bg-[#f97316] group-hover:text-white">
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
              <h3 className="mb-2 text-xl font-extrabold text-slate-900">
                全平台支援
              </h3>
              <p className="leading-7 text-slate-600">
                無論是桌機、平板還是手機，隨時隨地都能管理。
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white/80 py-14 text-slate-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* 品牌區塊 */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="text-2xl font-extrabold tracking-wide text-slate-900">
                炫揚文理
              </h3>
              <p className="max-w-sm leading-7 text-slate-600">
                致力於提供最優質的教育環境與智能化的管理系統。讓學習更有效率，讓管理更加輕鬆。
              </p>
              <div className="flex gap-4 pt-2">
                {/* 社群圖標 */}
                <a
                  href="#"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-all hover:bg-[#12345c] hover:text-white"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/kuosung2019?igsh=MW8wZ3ZrN281Z3VnOQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-all hover:bg-[#12345c] hover:text-white"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-yellow-50 text-slate-600 transition-all hover:bg-[#f97316] hover:text-white"
                >
                  <FaLine size={20} />
                </a>
              </div>
            </div>

            {/* 快速連結 */}
            <div className="space-y-4">
              <h4 className="text-lg font-extrabold text-slate-900">快速連結</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="transition-colors hover:text-[#12345c]">
                    關於我們
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#12345c]">
                    課程介紹
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#12345c]">
                    師資團隊
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#12345c]">
                    最新消息
                  </a>
                </li>
              </ul>
            </div>

            {/* 聯絡資訊 */}
            <div className="space-y-4">
              <h4 className="text-lg font-extrabold text-slate-900">聯絡我們</h4>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <svg
                    className="mt-1 h-5 w-5 shrink-0 text-[#f97316]"
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
                    台北市大安區羅斯福路171號7樓
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-[#f97316]"
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
                    className="h-5 w-5 shrink-0 text-[#f97316]"
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

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 md:flex-row">
            <p>© {new Date().getFullYear()} 炫揚文理 - 全心為你</p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-[#12345c]">
                隱私權政策
              </a>
              <a href="#" className="transition-colors hover:text-[#12345c]">
                服務條款
              </a>
              <a href="#" className="transition-colors hover:text-[#12345c]">
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
