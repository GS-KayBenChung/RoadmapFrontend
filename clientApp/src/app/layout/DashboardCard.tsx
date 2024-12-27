import { NavLink } from "react-router-dom";

interface Props {
  title: string;
  value?: string | number;
  progress?: React.ReactNode;
  filter?: string;
}

export default function DashboardCard({ title, value, progress, filter }: Props) {
  return (
    <NavLink to={`/content?filter=${filter}`}>
      <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center justify-center aspect-square">
        <p className="text-xl font-bold">{title}</p>
        <p className="text-5xl font-bold pt-8">{value}</p>
        {progress}
      </div>
    </NavLink>
  );
}
