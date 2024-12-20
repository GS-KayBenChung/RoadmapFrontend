import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { roadmapCreateStore } from "../../app/stores/roadmapCreateStore";
import createRoadmapHierarchy from "./createRoadmapLevel";
import { createRoadmap, RoadmapDto } from "../../services/roadmapServices"; 
import { formatDate } from "../DateTimeFormat";
import { useNavigate } from "react-router-dom";

export default observer(function StepperThird() {
  const navigate = useNavigate();
  const { roadmapTitle, roadmapDescription, milestones } = roadmapCreateStore;

  const handleSubmit = async () => {
    createRoadmapHierarchy();

    const roadmapData: RoadmapDto = {
      title: roadmapTitle,
      description: roadmapDescription,
      createdBy: "0e7d3f8c-845c-4c69-b50d-9f07c0c7b98f",  
      overall_progress: 0, 
      overall_duration: 0, 
      isCompleted: false, 
      isDraft: true, 
      isDeleted: false, 
      milestones: milestones.map((milestone) => ({
        name: milestone.title,
        description: milestone.description,
        milestone_progress: 0, 
        isCompleted: false, 
        isDeleted: false, 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sections: milestone.sections.map((section) => ({
          name: section.title,
          description: section.description,
          isCompleted: false, 
          isDeleted: false, 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tasks: section.tasks.map((task) => ({
            name: task.title,
            dateStart: new Date(task.startDate).toISOString(), 
            dateEnd: new Date(task.endDate).toISOString(),
            isCompleted: false, 
            isDeleted: false, 
            created_at: new Date().toISOString(),
            updated_at: formatDate(new Date()),
          })),
        })),
      })),
    };
        
    try {
      console.log("Roadmap data being sent:", roadmapData);
      const result = await createRoadmap(roadmapData);
      console.log("Roadmap created successfully:", result);
      navigate('/content');
    } catch (error) {
      console.error("Error creating roadmap:", error);
    }
  };

  return (
    <Box className="p-8 bg-gray-300 rounded-lg shadow-xl">
      <div className="text-center text-4xl font-extrabold text-indigo-900 mb-8">
        Review Your Roadmap
      </div>
      <div className="space-y-4 mb-8">
        <div>
          <p className="text-xl font-semibold text-gray-800">Roadmap Title:</p>
          <p className="text-lg text-gray-600">{roadmapTitle}</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-800">Roadmap Description:</p>
          <p className="text-lg text-gray-600">{roadmapDescription}</p>
        </div>
      </div>

      {milestones.map((milestone, milestoneIndex) => (
        <div key={milestoneIndex} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h6 className="text-2xl font-semibold text-indigo-800">{`Milestone ${milestoneIndex + 1}: ${milestone.title}`}</h6>
            <p className="text-gray-600 text-sm">{milestone.description}</p>
          </div>

          {milestone.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-indigo-700">{`Section ${sectionIndex + 1}: ${section.title}`}</p>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>

              {section.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="mt-2 ml-6 p-4 bg-indigo-50 rounded-lg shadow-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-700 font-medium">{`Task ${taskIndex + 1}: ${task.title}`}</p>
                    <p className="text-gray-500 text-xs">{`Start: ${task.startDate}, End: ${task.endDate}`}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <p className="text-center text-2xl text-black mt-6">
        Ensure all details are correct before submitting.
      </p>

      <button
        onClick={handleSubmit}
        className="my-6 block mx-auto bg-blue-500 text-white p-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create Roadmap
      </button>
    </Box>
  );
});
