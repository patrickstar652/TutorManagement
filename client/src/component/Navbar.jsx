import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import Logout from "../pages/Logout";
import * as jwt_decode from "jwt-decode";

function Navbar() {
  const token = localStorage.getItem("token");
  let user_info = jwt_decode.jwtDecode(token);
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    Logout();
    navigate('/');
  };

  return (
    <>
      <nav className="relative text-3xl bg-white text-blue-900 shadow-lg py-3">
        {/* <nav className="relative text-3xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg py-3"> */}
        <span className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <FaBook className="text-2xl text-yellow-300 hover:text-yellow-400 transition-colors" />
          <span className="font-semibold">炫揚文理</span>
        </span>
        <div className="flex justify-center gap-12 max-w-screen-xl mx-auto">
          <Link className="hover:text-yellow-300 transition-colors font-medium">
            首頁
          </Link>
          <Link className="hover:text-yellow-300 transition-colors font-medium">
            登入
          </Link>
          <Link
            className="hover:text-yellow-300 transition-colors font-medium"
            onClick={handleLogout}
          >
            登出
          </Link>
        </div>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-orange-300 px-4 py-1 rounded-full text-lg text-white">
          {user_info.account}
        </span>
      </nav>
    </>
  );
}

export default Navbar;
