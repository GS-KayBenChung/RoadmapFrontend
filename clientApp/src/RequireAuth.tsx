import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "./store";

export default function RequireAuth() {
  const { userStore } = useStore();
  const location = useLocation();

  if (!userStore.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}
