import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import RoadmapDashboard from "../../features/dashboard/RoadmapDashboard";
import RoadmapsPage from "../../features/dashboard/RoadmapContent";
import LoginDashboard from "../../features/dashboard/LoginDashboard";
import { useStore } from "../../store";
import RoadmapCreate from "../../features/dashboard/RoadmapCreate";
import RoadmapDetails from "../../features/dashboard/RoadmapDetails";


function ProtectedRoute({ element }: { element: JSX.Element }) {
  const { userStore } = useStore();

  return userStore.isLoggedIn ? element : <LoginDashboard />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <LoginDashboard /> },
      { path: "content", element: <ProtectedRoute element={<RoadmapsPage />} /> },
      { path: "dashboard", element: <ProtectedRoute element={<RoadmapDashboard />} /> },
      { path: "dashboard/:id", element: <ProtectedRoute element={<RoadmapDetails />} /> },
      { path: "roadmapCreate", element: <ProtectedRoute element={<RoadmapCreate />} /> },
    ],
  },
]);
