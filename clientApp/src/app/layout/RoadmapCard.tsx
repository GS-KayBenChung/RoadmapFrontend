import { NavLink } from "react-router-dom";
import CircularProgressBar from "../../features/CircularProgressBar";

interface Props {
  name: string;
  progress: number;
  roadmapId: string;
}

export default function RoadmapCard({ name, progress, roadmapId }: Props) {
  return (
    <NavLink to={`/roadmap/${roadmapId}`}>
      <div className="bg-gray-100 p-2 rounded-lg flex flex-col items-center text-center shadow-md aspect-square scale-75">
        <div className="my-12 w-3/5">
          <CircularProgressBar percentage={progress} />
        </div>
        <p className="text-3xl font-medium text-gray-700 my-auto">{name}</p>
      </div>
    </NavLink>
  );
}