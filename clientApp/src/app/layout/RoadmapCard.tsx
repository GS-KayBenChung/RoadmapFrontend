import CircularProgressBar from "../../features/CircularProgressBar"; // Import Circular Progress bar component

interface Props {
  name: string;
  progress: number;
}

export default function RoadmapCard({ name, progress }: Props) {
  return (
    <div className="bg-gray-100 p-2 rounded-lg flex flex-col items-center text-center shadow-md aspect-square scale-75">
      <div className="my-12 w-3/5">
        <CircularProgressBar percentage={progress} />
      </div>
      <p className="text-3xl font-medium text-gray-700 my-auto">{name}</p>
    </div>
  );
}
