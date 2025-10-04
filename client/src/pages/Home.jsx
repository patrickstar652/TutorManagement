import Navbar from "../component/Navbar";
import Carousel from "../component/Carousel";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Home() {
  const navigate = useNavigate();

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    } catch {
      localStorage.removeItem('token');
      return false;
    }
  };

  const handleStartUsing = () => {
    if (checkAuth()) {
      navigate('/course');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="scroll-smooth">
      {/* 固定在最上方的導覽列 */}
      <div className="fixed top-0 left-0 right-0 z-50 ">
        <Navbar />
      </div>
      
      {/* 第一個全屏區塊 - 主要內容 */}
      <div
        className="h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('/background.jpg')`,
        }}
      >
        {/* 網站介紹內容 */}
        <div className="relative z-10 h-full flex items-center justify-center pt-16">
          <div className="text-center px-6 max-w-4xl ">
            <div className="relative inline-block mb-6 p-8">
              {/* 標題背景遮罩 */}
              <div className="absolute inset-0 bg-white opacity-80 rounded-2xl "></div>
              <h1 className="relative text-6xl font-bold bg-gradient-to-r from-blue-800 via-blue-400 to-blue-800 bg-clip-text text-transparent">
                座位管理系統
              </h1>
            </div>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              專為教育機構設計的智能座位管理解決方案，讓課程管理變得更加簡單高效
            </p>
            
            {/* 功能特色 */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white opacity-90 rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-4">🏫</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">課程管理</h3>
                <p className="text-blue-400">輕鬆建立和管理您的課程安排</p>
              </div>
              
              <div className="bg-white opacity-90 rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-4">💺</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">座位安排</h3>
                <p className="text-blue-400">直觀的座位表讓學生安排一目了然</p>
              </div>
              
              <div className="bg-white opacity-90 rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">即時更新</h3>
                <p className="text-blue-400">座位資訊即時同步，管理更有效率</p>
              </div>
            </div>
            
            {/* 操作按鈕 */}
            <div className="space-x-4 mb-8">
              <button 
                onClick={handleStartUsing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                開始使用
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-lg transition-all duration-300">
                了解更多
              </button>
            </div>
            
            {/* 向下滾動提示 */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* 第二個全屏區塊 - 水平線區塊 */}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <hr className="border-t-2 border-orange-500 mb-8"/>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">更多精彩功能</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            我們正在不斷改進和添加新功能，為您提供更好的使用體驗
          </p>

          {/* Carousel 組件 */}
          <Carousel />
          
          {/* 添加更多內容 */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">智能分析</h3>
              <p className="text-gray-600">深度分析座位使用情況，提供優化建議</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">多平台支援</h3>
              <p className="text-gray-600">支援手機、平板、電腦等多種設備</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
