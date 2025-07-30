import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children }) {
  const location = useLocation();
  
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return false;
      }

      // 檢查 token 是否有效
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // 檢查 token 是否過期
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token 驗證失敗:', error);
      localStorage.removeItem('token');
      return false;
    }
  };

  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    // 儲存使用者原本想要存取的頁面
    // 如果未登入，重導向到登入頁面，並傳遞原本想要存取的路徑
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果已登入，顯示原本的組件
  return children;
}

export default ProtectedRoute;
