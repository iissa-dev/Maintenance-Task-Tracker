import Sidebar from "../../../layouts/Sidebar";
import DashboardContainer from "../../../features/dashboard/components/DdashboradContainer";

function Dashboard() {
    return (
        <div className="flex h-screen">
            <Sidebar/>
            <div className="flex flex-col flex-1 relative">
                <div>
                    <DashboardContainer/>
                    
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
