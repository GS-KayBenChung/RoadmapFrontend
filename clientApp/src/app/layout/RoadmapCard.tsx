import { NavLink } from "react-router-dom";
import CircularProgressBar from "../../features/CircularProgressBar";

interface Props {
  name: string;
  progress: number;
  roadmapId: string;
}

export default function RoadmapCard({ name, progress, roadmapId }: Props) {
  return (
    // <NavLink to={`/roadmap/${roadmapId}`}>
    //   <div className="bg-gray-100 rounded-lg items-center shadow-md p-4">
    //     <div className="my-12">
    //       <CircularProgressBar percentage={progress} />
    //     </div>
    //     <p className="text-xl sm:text-xl md:text-2xl font-medium text-gray-700 my-auto text-center">{name}</p>
    //   </div>
    // </NavLink>
    <NavLink to={`/roadmap/${roadmapId}`}>
      <div className="bg-gray-100 rounded-lg shadow-md p-4 flex flex-col items-center justify-between h-full">
        <div className="my-8">
          <CircularProgressBar percentage={progress} />
        </div>
        <p className="text-center text-xl sm:text-xl md:text-2xl font-medium text-gray-700 line-clamp-2">
          {name}
        </p>
      </div>
    </NavLink>

  );
}