import {
  faChartBar,
  faFolder,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
function Sidebar() {
  return (
    <div className="bg-sky-900 text-white w-[250px] p-[20px] text-[20px]">
      <ul className="mt-[100px]">
        <li className="mb-[20px] transition-all duration-[0.5s] cursor-pointer hover:bg-neutral-50/25 px-[20px] py-[5px] rounded-[6px]">
          <FontAwesomeIcon icon={faChartBar} />
          <span className="ml-[5px]">
            <Link to={"/"}>Dashboard</Link>
          </span>
        </li>
        <li className="mb-[20px] cursor-pointer hover:bg-neutral-50/25 px-[20px] py-[5px] rounded-[6px]">
          <FontAwesomeIcon icon={faList} />
          <span className="ml-[5px]">
            <Link to={"/request"}>Requests</Link>
          </span>
        </li>
        <li className="mb-[20px] cursor-pointer hover:bg-neutral-50/25 px-[20px] py-[5px] rounded-[6px]">
          <FontAwesomeIcon icon={faFolder} />
          <span className="ml-[5px]">Categories</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
