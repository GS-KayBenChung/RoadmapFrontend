import { Roadmap } from "../../app/models/roadmap"

interface Props{
    roadmap: Roadmap
}

export default function RoadmapDetails({roadmap}: Props) {
    return(
        <>
            <div>
                {roadmap.title}
                {roadmap.description}
                {roadmap.overallDuration}
            </div>
        </>
    )
}