import Sidebar from "../layouts/Sidebar";
import DashboardContainer from "../components/DdashboradContainer";

function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <div>
          <DashboardContainer />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
