// 引入 React 與 useState Hook
import React, { useState } from "react";
// 引入 axios 用來發送 HTTP 請求
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  // 定義三個狀態變數：
  const [account, setAccount] = useState(""); // 使用者輸入的帳號
  const [password, setPassword] = useState(""); // 使用者輸入的密碼
  const [message, setMessage] = useState(""); // 顯示伺服器回傳的訊息
  const navigate = useNavigate();
  const location = useLocation();
  
  // 取得使用者原本想要存取的頁面，如果沒有則預設為 /success
  const from = location.state?.from?.pathname || "/success";
  // 登入表單提交處理函式
  const handleLogin = async (e) => {
    e.preventDefault(); // 防止表單預設的重新整理行為
    try {
      console.log("開始發送登入請求...");

      // 發送 POST 請求到後端伺服器
      // data: { success: true, message: '登入成功' } // ← 回傳的 JSON 內容
      // axios 自動你包好的屬性
      const response = await axios.post("http://localhost:3000/login", {
        account,
        password,
      });

      console.log("收到伺服器回應:", response.data);

      // 將伺服器回傳的訊息設定到 message 狀態
      setMessage(response.data.message);

      // 如果登入成功，導向到原本想要存取的頁面
      if (response.data.success) {
        // ✅ 儲存 token 到 localStorage
        localStorage.setItem("token", response.data.token);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("登入失敗，錯誤詳情:", error);

      // 根據錯誤類型顯示不同的錯誤訊息
      if (error.code === "ERR_NETWORK") {
        // 如果是網路錯誤，表示伺服器連不到
        setMessage("無法連接到伺服器，請確認伺服器是否已啟動");
      } else {
        // 其他錯誤，優先顯示伺服器回傳的錯誤訊息，否則顯示「未知錯誤」
        setMessage(error.response?.data?.message || "發生未知錯誤");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* 登入卡片 */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          {/* 標題區域 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              歡迎回來
            </h2>
            <p className="text-gray-600">請登入您的帳戶</p>
          </div>

          {/* 登入表單 */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* 帳號欄位 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                帳號
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="請輸入您的帳號"
                />
              </div>
            </div>

            {/* 密碼欄位 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                密碼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="請輸入您的密碼"
                />
              </div>
            </div>

            {/* 登入按鈕 */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                登入
              </span>
            </button>
          </form>

          {/* 顯示訊息 */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-medium ${
              message.includes('成功') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className="flex items-center justify-center">
                {message.includes('成功') ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}
        </div>

        {/* 底部裝飾 */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2025 炫揚文理 - 全心為你
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

//輸入文字 "abc"
//⬇
//onChange → setAccount("abc")
//⬇
//React 自動重新渲染
//⬇
//<input value="abc" />
//⬇
//按下登入 → axios.post(account)
