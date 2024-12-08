import NavItem from "./NavItem";
import LogoutButton from "../../Logout";

export default function NavLinks() {

  return (
    <>
      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/content">Roadmaps</NavItem>
      <NavItem to="/logs">Logs</NavItem>
      <LogoutButton/>
    </>
  );
}
