import { NavLink } from "react-router-dom";

interface Props {
  title: string;
  value?: string | number;
  progress?: React.ReactNode;
  filter?: string;
}

export default function DashboardCard({ title, value = 0, progress, filter }: Props) {
  const cardContent = (
    <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center justify-center aspect-square">
      <p className="text-xl font-bold">{title}</p>
      {progress ? progress : <p className="text-5xl font-bold pt-8">{value}</p>}
    </div>
  );

  return filter ? (
    <NavLink to={`/content?filter=${filter}`} aria-label={`View ${title}`}>
      {cardContent}
    </NavLink>
  ) : (
    cardContent
  );
}