import { Roadmap } from "../../app/models/roadmap";

interface Props{
    roadmaps: Roadmap[];
}

export default function RoadmapList({roadmaps}: Props){
    return(
        <>
            <h1 className="text-5xl font-bold underline">Test Roadmap</h1>
            <ul>
                {roadmaps.map(roadmap => (
                    <li key={roadmap.roadmapId}>
                        {roadmap.title}
                        {roadmap.description}
                    </li>
                ))}
            </ul>

        </>
    )
}