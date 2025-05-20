import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import * as jwt_decode from "jwt-decode";
function Navbar({ handleLogout }) {

  const token = localStorage.getItem("token");
  let user_info = jwt_decode.jwtDecode(token);
  return (
    <>
      <nav className="relative text-3xl text-white bg-blue-200 opacity-80 py-3">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <FaBook className="text-2xl" />
          <span>炫揚文理</span>
        </span>
        <div className="flex justify-center gap-12 max-w-screen-xl mx-auto">
          <Link>首頁</Link>
          <Link>登入</Link>
          <Link onClick={handleLogout}>登出</Link>
        </div>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">{user_info.account}</span>
      </nav>
    </>
  );
}
export default Navbar;
