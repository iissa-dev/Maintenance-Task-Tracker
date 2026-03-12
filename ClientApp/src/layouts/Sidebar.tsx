import {
  faChartBar,
  faFolder,
  faList,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const { pathname } = useLocation();

  const baseClass = `mb-5 transition-all duration-500 cursor-pointer hover:bg-white/10 
                     md:px-5 md:py-1.25 md:rounded-md w-12.5 h-12.5 md:h-auto md:w-auto 
                     rounded-full flex justify-center items-center md:block`;

  const activeClass = "bg-white/20 border border-white/20";

  const getClass = (path: string) =>
    `${baseClass} ${pathname === path ? activeClass : ""}`;

  return (
    <div className="p-5 text-[20px] h-screen border-r neon-border w-16 md:w-62.5 transition-all duration-300 flex flex-col justify-between">
      <ul className="mt-25 flex items-center flex-col md:block">
        <Link to="/">
          <li className={getClass("/")}>
            <FontAwesomeIcon icon={faChartBar} />
            <span className="ml-1.25 hidden md:inline">Dashboard</span>
          </li>
        </Link>
        <Link to="/request">
          <li className={getClass("/request")}>
            <FontAwesomeIcon icon={faList} />
            <span className="ml-1.25 hidden md:inline">Requests</span>
          </li>
        </Link>
        <Link to="/UserManagement">
          <li className={getClass("/UserManagement")}>
            <FontAwesomeIcon icon={faFolder} />
            <span className="ml-1.25 hidden md:inline">Users</span>
          </li>
        </Link>
      </ul>
      <div>
        <Link to={"/login"}>
          <FontAwesomeIcon icon={faUser} />
          <span className="ml-1.25 hidden md:inline">Login</span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
