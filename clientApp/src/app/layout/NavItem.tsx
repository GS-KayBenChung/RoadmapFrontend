import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  children: React.ReactNode; // Accept strings, JSX, or components
}

export default function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `hover:text-black font-bold ${isActive ? "text-blue-500" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}
