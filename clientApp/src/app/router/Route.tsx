import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import RoadmapDashboard from "../../features/dashboard/RoadmapDashboard";
import RoadmapsPage from "../../features/dashboard/RoadmapContent";
import { useStore } from "../stores/store";
import RoadmapCreate from "../../features/dashboard/RoadmapCreate";
import RoadmapDetails from "../../features/dashboard/RoadmapDetails";
import RoadmapAudit from "../../features/dashboard/RoadmapAudit";
import RoadmapEdit from "../../features/dashboard/RoadmapEdit";
import LoginGoogle from "../../features/dashboard/LoginGoogle";
import EditPageTest from "../../features/roadmapEdit/EditPageTest";

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const { userStore } = useStore();

  if (!userStore.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return element;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <LoginGoogle /> },
      { path: "content", element: <ProtectedRoute element={<RoadmapsPage />} /> },
      { path: "dashboard", element: <ProtectedRoute element={<RoadmapDashboard />} /> },
      { path: "roadmap/:id", element: <ProtectedRoute element={<RoadmapDetails />} /> },
      { path: "roadmapCreate", element: <ProtectedRoute element={<RoadmapCreate />} /> },
      // { path: "roadmapEdit/:id", element: <ProtectedRoute element={<RoadmapEdit />} /> },
      { path: "roadmapEdit/:id", element: <ProtectedRoute element={<EditPageTest />} /> },
      { path: "audit", element: <ProtectedRoute element={<RoadmapAudit />} /> },
    ],
  },
]); 