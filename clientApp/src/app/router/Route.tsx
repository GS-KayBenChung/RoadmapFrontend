import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import RoadmapDashboard from "../../features/dashboard/RoadmapDashboard";
import RoadmapContent from "../../features/dashboard/RoadmapContent";
import RoadmapCreate from "../../features/dashboard/RoadmapCreate";
import TestDashboard from "../../features/TestDashboard";


export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children:[
            {path:'', element: <RoadmapDashboard/>},
            {path:'roadmaps', element: <RoadmapContent />},
            {path:'roadmapCreate', element: <RoadmapCreate/>},
            {path:'test', element: <TestDashboard/>},
        ]
    },
]

export const router = createBrowserRouter(routes);