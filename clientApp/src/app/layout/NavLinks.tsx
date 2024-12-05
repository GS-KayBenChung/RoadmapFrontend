import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import NavItem from "./NavItem";

export default function NavLinks() {
  const { userStore } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    userStore.logout();
    navigate("/login");
  };
  return (
    <>
      <NavItem to="/">Dashboard</NavItem>
      <NavItem to="/roadmaps">Roadmaps</NavItem>
      <NavItem to="/logs">Logs</NavItem>
      <button 
        onClick={handleLogout}
        className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800">
        Log Out
      </button>
    </>
  );
}
