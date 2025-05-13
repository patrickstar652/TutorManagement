// 引入 React 與 useState Hook
import React, { useState } from 'react';
// 引入 axios 用來發送 HTTP 請求
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  // 定義三個狀態變數：
  const [account, setAccount] = useState('');  // 使用者輸入的帳號
  const [password, setPassword] = useState(''); // 使用者輸入的密碼
  const [message, setMessage] = useState('');   // 顯示伺服器回傳的訊息
  const navigate = useNavigate();
  // 登入表單提交處理函式
  const handleLogin = async (e) => {
    e.preventDefault();  // 防止表單預設的重新整理行為
    try {
      console.log('開始發送登入請求...');
      
      // 發送 POST 請求到後端伺服器
      // data: { success: true, message: '登入成功' } // ← 回傳的 JSON 內容
      // axios 自動你包好的屬性
      const response = await axios.post('http://localhost:3000/login', {
        account,
        password
      });

      console.log('收到伺服器回應:', response.data);

      // 將伺服器回傳的訊息設定到 message 狀態
      setMessage(response.data.message);

      // 如果登入成功，導向到成功頁面
      if (response.data.success) {
        navigate('/success');
      }
      
    } catch (error) {
      console.error('登入失敗，錯誤詳情:', error);

      // 根據錯誤類型顯示不同的錯誤訊息
      if (error.code === 'ERR_NETWORK') {
        // 如果是網路錯誤，表示伺服器連不到
        setMessage('無法連接到伺服器，請確認伺服器是否已啟動');
      } else {
        // 其他錯誤，優先顯示伺服器回傳的錯誤訊息，否則顯示「未知錯誤」
        setMessage(error.response?.data?.message || '發生未知錯誤');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      {/* 標題 */}
      <h2>登入</h2>

      {/* 登入表單 */}
      <form onSubmit={handleLogin}>
        {/* 帳號欄位 */}
        <div>
          <label>帳號：</label>
          <input
            type="text"
            value={account} // 讓輸入框的內容「由 React 狀態控制」
            onChange={(e) => setAccount(e.target.value)} // 當輸入變動時更新 account 狀態
            required
          />
        </div>

        {/* 密碼欄位 */}
        <div>
          <label>密碼：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 當輸入變動時更新 password 狀態
            required
          />
        </div>

        {/* 登入按鈕 */}
        <button type="submit">登入</button>
      </form>

      {/* 顯示伺服器回傳的訊息（成功或錯誤） */}
      {/* message && <p>{message}</p>// short-circuit operator 短路運算子 */}
      {message ? <p>{message}</p> :null}
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
