import DashboardCard from "../../app/layout/DashboardCard";
import NavBar from "../../app/layout/NavBar";
import ScreenTitleName from "../ScreenTitleName";
import CircularProgress from "../CircularProgressBar";
import Footer from "../../app/layout/Footer";

export default function RoadmapDashboard() {

    const overallCompletionRate = 60; //TO REMOVE

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />

            <div className="w-full flex-grow bg-white my-24">
                <ScreenTitleName title="ROADMAP DASHBOARD"/>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mt-24">
                    <DashboardCard title="Current Roadmaps" value="13" />
                    <DashboardCard title="Completed Roadmap" value="1/3" />
                    <DashboardCard
                        title="Overall Completion Rate"
                        progress={
                            <div className="relative w-24 h-24 pt-2">
                                <CircularProgress percentage={overallCompletionRate} />
                            </div>
                        }
                    />
                    <DashboardCard title="Near Due Roadmap" value="7" />
                    <DashboardCard title="Overdue Roadmap" value="4" />
                    <DashboardCard title="Draft Roadmap" value="3" />
                </div>
            </div>

            <Footer />
        </div>
    );
}
