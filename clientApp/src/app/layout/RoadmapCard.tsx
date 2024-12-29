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
      <div className="bg-gray-100 rounded-lg items-center shadow-md p-4">
        <div className="my-12">
          <CircularProgressBar percentage={progress} />
        </div>
        <p className="text-xl sm:text-xl md:text-2xl font-medium text-gray-700 my-auto text-center">{name}</p>
      </div>
    </NavLink>
  );
}