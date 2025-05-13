import { useEffect, useState } from 'react';
import axios from 'axios';

function Success() {
  const [welcomeData, setWelcomeData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/success')
      .then(res => setWelcomeData(res.data))
      .catch(err => console.error('錯誤', err));
  }, []);

  return (
    <div>
      <h2>🎉 登入成功！</h2>
      {welcomeData && (
        <>
          <p>{welcomeData.message}</p>
          <p>伺服器時間：{welcomeData.time}</p>
        </>
      )}
    </div>
  );
}
export default Success;
