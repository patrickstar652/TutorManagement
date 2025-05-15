// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();

function Logout() {
    // navigate('/');
    localStorage.removeItem('token') // 或你儲存的 key 名稱
}

export default Logout