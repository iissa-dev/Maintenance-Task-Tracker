import Sidebar from "../layouts/Sidebar";
import Chart from "../components/dashboardChart";

function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <div>
          <Chart />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
