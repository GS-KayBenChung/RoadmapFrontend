import { Button } from "@mui/material";
import { Roadmap } from "../../app/models/roadmap";

interface Props {
    roadmap: Roadmap;
    cancelSelectRoadmap: () => void;
    openForm: (id: string) => void;
}

export default function TestDetails({roadmap, cancelSelectRoadmap, openForm}: Props) {
    return(
        <div className="bg-white max-w-sm rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{roadmap.title}</h2>
                <p className="text-sm text-gray-500">{roadmap.description}</p>
                <p className="mt-2 text-gray-700">{roadmap.overallProgress} </p>
            </div>
            <Button onClick={() => openForm(roadmap.roadmapId)}>Edit</Button>
            <Button onClick={cancelSelectRoadmap}>Cancel</Button>
        </div>
    )
}