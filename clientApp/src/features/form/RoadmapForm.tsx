import { ChangeEvent, useState } from "react";
import { Roadmap } from "../../app/models/roadmap"
import { Button } from "@mui/material";
import LoadingButtonComponent from "../../app/layout/LoadingButtonComponent";

interface Props {
    roadmap: Roadmap | undefined;
    closeForm: () => void;
    createOrEdit: (roadmap: Roadmap) => void;
    submitting: boolean;
}

export default function RoadmapForm({roadmap: selectedRoadmap, closeForm, createOrEdit, submitting}: Props){

    const initialState = selectedRoadmap ?? {
        roadmapId: '',
        title: '',
        description: '',
        createdBy: '0e7d3f8c-845c-4c69-b50d-9f07c0c7b98f',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        overallProgress: 0,
        overallDuration: 0,
        isCompleted: false,
        isDeleted: false,
        isDraft: false,
        createdByUser: null,
        milestones: [],
    }

    const [roadmap, setRoadmap] = useState(initialState);

    function handleSubmit() {
        createOrEdit(roadmap);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setRoadmap({...roadmap, [name]: value})
    }

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <form autoComplete="off" className="space-y-4"> {/*onSubmit={handleSubmit} */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            value={roadmap.title} name="title" onChange={handleInputChange}
                            type="text"
                            id="title"
                            placeholder="Title"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

        
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={roadmap.description} name="description" onChange={handleInputChange}
                            id="description"
                            placeholder="Description"
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                            Progress
                        </label>
                        <input
                            value={roadmap.overallProgress} name="overallProgress" onChange={handleInputChange}
                            type="text"
                            id="progress"
                            placeholder="Progress"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                    <button
                        className={`w-full py-2 px-4 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 mb-4 ${
                            submitting
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                        }`}
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (                
                            <LoadingButtonComponent/>
                        ) : (
                            "Submit"
                        )}
                    </button>
                        {/* <Button
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button> */}
                       
                        <Button
                            onClick={closeForm}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}