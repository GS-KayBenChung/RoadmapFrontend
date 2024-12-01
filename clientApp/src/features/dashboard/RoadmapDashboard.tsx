import DashboardCard from "../../app/layout/DashboardCard";
import CircularProgress from "../CircularProgressBar";
import ScreenTitleName from "../ScreenTitleName";

export default function RoadmapDashboard() {
    const overallCompletionRate = 60;
    return (

      <div className="min-h-screen w-full bg-gray-400 flex flex-col items-center m-0 py-16">
      
        <ScreenTitleName title="ROADMAP DASHBOARD"/>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">

            <DashboardCard title="Current Roadmaps" value="3"/>
            <DashboardCard title="Completed Roadmap" value="1/3"/>
            <DashboardCard title="Overall Completion Rate" progress={
                <div className="relative w-20 h-20 pt-4">
                    <CircularProgress percentage={overallCompletionRate} />
                </div>
            }/>
            <DashboardCard title="Overall Completion Rate"/>
            <DashboardCard title="Near Due Roadmap" value="1"/>
            <DashboardCard title="Overdue Roadmap" value="1"/>
        </div>
 
        
      </div>
    );
  }
  