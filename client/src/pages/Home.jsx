import Navbar from "../component/Navbar";
import Carousel from "../component/Carousel";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
        <div className="absolute inset-0 pointer-events-none">
          {/* 右上角圓形裝飾 */}
          <div className="absolute top-20 right-[-100px] w-96 h-96 border border-gray-100 rounded-full opacity-60"></div>
          <div className="absolute top-40 right-[-50px] w-64 h-64 bg-blue-50 rounded-full opacity-40"></div>

          {/* 左下角方塊裝飾 */}
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-indigo-50 transform rotate-12"></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 border-2 border-blue-100 transform -rotate-12"></div>

          {/* 網格線條 */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gray-50"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gray-50"></div>
          <div className="absolute top-0 left-1/4 h-full w-px bg-gray-50"></div>
          <div className="absolute top-0 right-1/4 h-full w-px bg-gray-50"></div>
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

      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p>© 2024 座位管理系統. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
