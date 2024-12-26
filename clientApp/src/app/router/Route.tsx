import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import RoadmapDashboard from "../../features/dashboard/RoadmapDashboard";
import RoadmapsPage from "../../features/dashboard/RoadmapContent";
import LoginDashboard from "../../features/dashboard/LoginDashboard";
import { useStore } from "../stores/store";
import RoadmapCreate from "../../features/dashboard/RoadmapCreate";
import RoadmapDetails from "../../features/dashboard/RoadmapDetails";
import RoadmapAudit from "../../features/dashboard/RoadmapAudit";
import RoadmapEdit from "../../features/dashboard/RoadmapEdit";

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
      { path: "roadmap/:id", element: <ProtectedRoute element={<RoadmapDetails />} /> },
      { path: "roadmapTest", element: <ProtectedRoute element={<RoadmapDetails />} /> },
      { path: "roadmapCreate", element: <ProtectedRoute element={<RoadmapCreate />} /> },
      { path: "roadmapEdit/:id", element: <ProtectedRoute element={<RoadmapEdit />} /> },
      { path: "audit", element: <ProtectedRoute element={<RoadmapAudit />} /> },
    ],
  },
]);