import { useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import DashboardCard from "../../app/layout/DashboardCard";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";
import CircularProgress from "../CircularProgressBar";
import Footer from "../../app/layout/Footer";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function RoadmapDashboard() {
  const { roadmapStore } = useStore();
  const { dashboardStats, loadingInitial, loadDashboardStats } = roadmapStore;
  const {
    totalRoadmaps = 0,
    completedRoadmaps = 0,
    nearDueRoadmaps = 0,
    overdueRoadmaps = 0,
    draftRoadmaps = 0
  } = dashboardStats;
  
  const completionRate = totalRoadmaps > 0
    ? Math.round((completedRoadmaps / totalRoadmaps) * 100)
    : 0;
    
  const dashboardCards = [
    { title: "Current Roadmaps", value: totalRoadmaps },
    { title: "Completed Roadmap", value: `${completedRoadmaps}/${totalRoadmaps}`, filter: "completed" },
    { 
      title: "Overall Completion Rate", 
      progress: (
        <div className="relative w-24 h-24 pt-2">
          <CircularProgress percentage={completionRate} />
        </div>
      )
    },
    { title: "Near Due Roadmap", value: nearDueRoadmaps, filter: "neardue" },
    { title: "Overdue Roadmap", value: overdueRoadmaps, filter: "overdue" },
    { title: "Draft Roadmap", value: draftRoadmaps, filter: "draft" }
  ];
  
  const loadStats = useCallback(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);
  
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loadingInitial) return <LoadingComponent />;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="w-full flex-grow bg-white my-24">
        <ScreenTitleName title="ROADMAP DASHBOARD" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mt-24">
          {dashboardCards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
});