import { createBrowserRouter } from 'react-router-dom';
import App from "../layout/App";
import RoadmapDashboard from '../../features/dashboard/RoadmapDashboard';
import RoadmapsPage from '../../features/dashboard/RoadmapContent';
import LoginDashboard from '../../features/dashboard/LoginDashboard';
import RoadmapStepper from '../../features/dashboard/RoadmapCreate';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <LoginDashboard /> },
      { path: "content", element: <RoadmapsPage /> },
      { path: "dashboard", element: <RoadmapDashboard /> },
      { path: "roadmapCreate", element: <RoadmapStepper /> },
    ],
  },
]);
