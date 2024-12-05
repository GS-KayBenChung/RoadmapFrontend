import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layout/App";
import RoadmapDashboard from "../../features/dashboard/RoadmapDashboard";
import RoadmapContent from "../../features/dashboard/RoadmapContent";
import RoadmapCreate from "../../features/dashboard/RoadmapCreate";
import TestDashboard from "../../features/TestDashboard";
import LoginDashboard from "../../features/dashboard/LoginDashboard";
import RequireAuth from "../../RequireAuth";
//import RoadmapTesting from "../../features/dashboard/RoadmapTesting";

export const routes: RouteObject[] = [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "login", element: <LoginDashboard /> },
        {
          element: <RequireAuth />, // Protect these routes
          children: [
            {path:'dashboard', element: <RoadmapDashboard/>},
            {path:'roadmaps', element: <RoadmapContent />},
            {path:'roadmapCreate', element: <RoadmapCreate/>},
            {path:'test', element: <TestDashboard/>},
            {path:'login', element: <LoginDashboard/>},
          ],
        },
        { path: "*", element: <Navigate replace to="/login" /> },
      ],
    },
  ];

// export const routes: RouteObject[] = [
//     {
//         path: "/",
//         element: <App />,
//         children:[
//             {path:'', element: <RoadmapDashboard/>},
//             {path:'roadmaps', element: <RoadmapContent />},
//             {path:'roadmapCreate', element: <RoadmapCreate/>},
//             {path:'test', element: <TestDashboard/>},
//             {path:'login', element: <LoginDashboard/>},
//         ]
//     },
// ]

export const router = createBrowserRouter(routes);