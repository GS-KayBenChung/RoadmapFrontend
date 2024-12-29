import DashboardCard from "../../app/layout/DashboardCard";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";
import CircularProgress from "../CircularProgressBar";
import Footer from "../../app/layout/Footer";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export default observer( function RoadmapDashboard() {
  const { roadmapStore } = useStore(); 

  const { loadRoadmaps } = roadmapStore;

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="w-full flex-grow bg-white my-24">
        <ScreenTitleName title="ROADMAP DASHBOARD"/>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mt-24">
        <DashboardCard title="Current Roadmaps" value={roadmapStore.dashboardStats.totalRoadmaps} />
        <DashboardCard title="Completed Roadmap" value={`${roadmapStore.dashboardStats.completedRoadmaps}/${roadmapStore.dashboardStats.totalRoadmaps}`} filter="completed" />
        <DashboardCard
          title="Overall Completion Rate"
          progress={<div className="relative w-24 h-24 pt-2"><CircularProgress percentage={Math.round((roadmapStore.dashboardStats.completedRoadmaps / roadmapStore.dashboardStats.totalRoadmaps) * 100)} /></div>}
        />
        <DashboardCard title="Near Due Roadmap" value={88} />
        <DashboardCard title="Overdue Roadmap" value={88} />
        <DashboardCard title="Draft Roadmap" value={roadmapStore.dashboardStats.draftRoadmaps} filter="draft" />
        </div>
      </div>

      <Footer />
    </div>
  );
})