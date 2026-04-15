import {
  faChartBar,
  faFolder,
  faList,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Sidebar() {
  const { pathname } = useLocation();
  const { isAuthenticated, loading, logout } = useAuth();

  const baseClass = `mb-5 transition-all duration-500 cursor-pointer hover:bg-white/10 
                     md:px-5 md:py-1.25 md:rounded-md w-12.5 h-12.5 md:h-auto md:w-auto 
                     rounded-full flex justify-center items-center md:block`;

  const activeClass = "bg-white/20 border border-white/20";

  const getClass = (path: string) =>
    `${baseClass} ${pathname === path ? activeClass : ""}`;

  return (
    <div className="p-5 text-[20px] h-screen border-r neon-border w-16 md:w-62.5 transition-all duration-300 flex flex-col justify-between">
      <ul className="mt-25 flex items-center flex-col md:block">
        <li className={getClass("/")}>
          <Link to="/">
            <FontAwesomeIcon icon={faChartBar} />
            <span className="ml-1.25 hidden md:inline">Dashboard</span>
          </Link>
        </li>
        <li className={getClass("/request")}>
          <Link to="/request">
            <FontAwesomeIcon icon={faList} />
            <span className="ml-1.25 hidden md:inline">Requests</span>
          </Link>
        </li>
        <li className={getClass("/UserManagement")}>
          <Link to="/UserManagement">
            <FontAwesomeIcon icon={faUsers} />
            <span className="ml-1.25 hidden md:inline">Users</span>
          </Link>
        </li>
        <li className={getClass("/serviceManagement")}>
          <Link to="/serviceManagement">
            <FontAwesomeIcon icon={faFolder} />
            <span className="ml-1.25 hidden md:inline">Services</span>
          </Link>
        </li>
      </ul>
      <div>
        <div>
          {loading ? (
            <div className="flex items-center text-soft animate-pulse opacity-50">
              <FontAwesomeIcon icon={faUser} />
              <span className="ml-1.25 hidden md:inline text-sm">
                Loading...
              </span>
            </div>
          ) : isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="cursor-pointer hover:text-white/70 transition-colors"
            >
              <FontAwesomeIcon icon={faUser} />
              <span className="ml-1.25 hidden md:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="cursor-pointer hover:text-white/70 transition-colors"
            >
              <FontAwesomeIcon icon={faUser} />
              <span className="ml-1.25 hidden md:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
