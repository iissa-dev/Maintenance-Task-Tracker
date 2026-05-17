import { useState } from "react";
import HandleRequest from "../../requests/components/HandleRequest.tsx";
import DashboardChart from "./dashboardChart.tsx";
import { ThreeDot } from "react-loading-indicators";
import Header from "../../../layouts/Header.tsx";
import DashboardStatsCard from "./DashboardStatsCard.tsx";
import RecentActivitySection from "./RecentActivitySection.tsx";
import { useRecentRequest } from "../api/dashboard.mutations.ts";

function DashboardContainer() {
  const [openAddForm, setOpenAddFrom] = useState(false);
  const { isLoading } = useRecentRequest();
  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-background">
          <ThreeDot
            variant="bounce"
            color="var(--color-primary)"
            size="medium"
            text="Loading"
            textColor="var(--color-primary)"
          />
        </div>
      ) : (
        <div className="flex min-h-screen bg-background">
          <HandleRequest
            isOpen={openAddForm}
            onClose={() => setOpenAddFrom(false)}
            Mode="Add"
            data={null}
          />

          <main className="flex-1 p-4 md:p-6">
            {/* Header */}
            <Header
              title={" Maintenance Overview"}
              subtitle={"Real-time monitoring of facility requests"}
              showAddButton={false}
            />

            {/* Stats Cards */}
            <DashboardStatsCard />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className="lg:col-span-2">
                <DashboardChart />
              </div>

              {/* Recent Activity Section */}
              <RecentActivitySection />
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default DashboardContainer;
