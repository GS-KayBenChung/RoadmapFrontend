import NavItem from "./NavItem";

export default function NavLinks() {
  return (
    <>
      <NavItem to="/">Dashboard</NavItem>
      <NavItem to="/roadmaps">Roadmaps</NavItem>
      <NavItem to="/logs">Logs</NavItem>
      <button className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800">
        Log Out
      </button>
    </>
  );
}
