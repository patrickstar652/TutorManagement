import { useEffect, useState } from "react";
import axios from "axios";
import Logout from "./Logout";
import {useNavigate} from "react-router-dom"

function Success() {
  const [welcomeData, setWelcomeData] = useState(null);

  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    Logout();
    navigate('/')
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/success")
      .then((res) => setWelcomeData(res.data))
      .catch((err) => console.error("錯誤", err));
  }, []);

  return (
    <>
      <div>
        <h2>🎉 登入成功！</h2>
        {welcomeData && (
          <>
            <p>{welcomeData.message}</p>
            <p>伺服器時間：{welcomeData.time}</p>
          </>
        )}
      </div>
      <form onSubmit={handleLogout}>
        <button type="submit">登出</button>
      </form>
    </>
  );
}
export default Success;

// get 從後端取得資料
// post 往後端傳資料

// ✅ 總結你剛問的問題：
// ❓ 兩段都是回傳 JSON，為什麼一個用 GET 一個用 POST？
// ✔️ 因為：
// GET 是前端「索取資料」（回傳是預期的行為）
// POST 是前端「提交資料」（回傳是處理結果）
