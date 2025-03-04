import NavItem from "./NavItem";
import LogoutButton from "../../features/Logout";

export default function NavLinks() {
  return (
    <>
      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/content">Roadmaps</NavItem>
      <NavItem to="/audit">Logs</NavItem>
      <LogoutButton/>
    </>
  );
}