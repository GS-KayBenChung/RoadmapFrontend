import { SyntheticEvent, useState } from "react";
import { Roadmap } from "../app/models/roadmap"
import LoadingButtonComponent from "../app/layout/LoadingButtonComponent";

interface Props {
    roadmaps: Roadmap[];
    selectRoadmap: (id: string) => void;
    deleteRoadmap: (id: string) => void;
    submitting: boolean;
}

export default function TestList({roadmaps, selectRoadmap, deleteRoadmap, submitting}: Props){
    
    const [target, setTarget] = useState('');

    function handleRoadmapDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
        setTarget(e.currentTarget.name);
        deleteRoadmap(id);
    }

    function handleGet(){
        console.log(roadmaps);
        
    }

    return(
        <div className="p-4 space-y-4">
            <button onClick={handleGet}>test Get</button>
            {roadmaps.map((roadmap) => (
                <div
                key={roadmap.roadmapId}
                className="bg-white p-4 rounded shadow flex flex-col space-y-2"
                >
                <h2 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                    {roadmap.title}
                </h2>
                <p className="text-sm text-gray-500">{roadmap.createdAt}</p>
                <div className="text-sm text-gray-700">
                    <p>{roadmap.description}</p>
                    <p className="mt-1 text-xs text-gray-400">{roadmap.isDraft}</p>
                </div>
                <div className="text-sm text-gray-700 border-2 border-black">
                    <p>Created By: {roadmap.createdBy}</p>
                    <p>Completed: {roadmap.isCompleted === true ? 'yes': 'no'}</p>
                    <p>Draft: {roadmap.isDraft === true ? 'yes': 'no'}</p>
                    <p>Overall Duration: {roadmap.overallDuration}</p>
                    <p>Overall Progress: {roadmap.overallProgress}</p>
                    <p>Created At: {roadmap.createdAt}</p>
                    <p>Updated At: {roadmap.updatedAt}</p>
                </div>
                <div className="mt-2">
                    <button 
                        onClick={() => selectRoadmap(roadmap.roadmapId)} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2">
                        View
                    </button>
                    <button 
                        name={roadmap.roadmapId}
                        disabled={submitting && target === roadmap.roadmapId} 
                        onClick={(e) => handleRoadmapDelete(e, roadmap.roadmapId)} 
                        /* // deleteRoadmap(roadmap.roadmapId) */
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        {submitting && target === roadmap.roadmapId ? (
                            <LoadingButtonComponent/>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
                </div>
            ))}
        </div>
    )
}