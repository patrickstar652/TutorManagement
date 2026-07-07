import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // 儲存使用者原本想要存取的頁面
    // 如果未登入，重導向到登入頁面，並傳遞原本想要存取的路徑
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果已登入，顯示原本的組件
  return children;
}

export default ProtectedRoute;
