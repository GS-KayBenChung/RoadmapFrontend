import { Box, Modal } from "@mui/material";
import { observer } from "mobx-react-lite";
import { roadmapCreateStore } from "../../app/stores/roadmapCreateStore";
import createRoadmapHierarchy from "./createRoadmapLevel";
import { createRoadmap, RoadmapDto } from "../../services/roadmapServices"; 
import { formatDate, formatDateOnly } from "../DateTimeFormat";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ScreenTitleName from "../ScreenTitleName";

// interface Task{
//   name: string;
//   completed: boolean;
//   dateStart: string;
//   dateEnd: string;
// };

// interface Section{
//   name: string;
//   tasks: Task[];
// };

export default observer(function StepperThird() {

  const navigate = useNavigate();
  const { roadmapTitle, roadmapDescription, milestones } = roadmapCreateStore;

  const [openPreview, setOpenPreview] = useState(false);

  const handleSubmit = async (isDraft: boolean) => {
    createRoadmapHierarchy();

    const roadmapData: RoadmapDto = {
      title: roadmapTitle,
      description: roadmapDescription,
      createdBy: "0e7d3f8c-845c-4c69-b50d-9f07c0c7b98f",  
      overall_progress: 0, 
      overall_duration: 0, 
      isCompleted: false, 
      isDraft: isDraft, 
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
      await createRoadmap(roadmapData);
      roadmapCreateStore.reset();
      navigate('/content');
    } catch (error) {
    }
  };

  const handlePreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const hasTasks = milestones.some(milestone => 
    milestone.sections.some(section => section.tasks.length > 0)
  );

  return (
    <Box className="p-8 bg-gray-300 rounded-lg shadow-xl">
      <div className="text-center text-4xl font-extrabold text-indigo-900 mb-8">
        Review Your Roadmap
      </div>
      <button
        onClick={handlePreview}
        className="bg-gray-500 text-white p-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Preview Roadmap Structure
      </button>
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

      <div className="flex justify-center space-x-4 my-6">
        <button
          onClick={() => handleSubmit(true)} 
          className="bg-gray-500 text-white p-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Save As Draft
        </button>
        {hasTasks && (
          <button
            onClick={() => handleSubmit(false)} 
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Publish Roadmap
          </button>
        )}
      </div>
      <Modal
        open={openPreview}
        onClose={handleClosePreview}
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-xl w-3/4 max-h-[80vh] overflow-auto">
          <ScreenTitleName title={roadmapTitle || 'Roadmap Details'} />
          <div className="max-w-screen-lg mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold leading-none flex-shrink-0">{roadmapTitle}</h1>
              </div>
            </div>
            <div>{roadmapDescription}</div>
          </div>

          <div className="max-w-screen-lg mx-auto p-4 mb-12">
            {milestones.map((milestone, milestoneIndex) => (
              <div key={milestoneIndex}>
                <div className="p-4 rounded-lg border-2 border-gray-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">{milestone.title}</h2>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {milestone.sections?.map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        className="p-4 border rounded-lg bg-gray-100"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <h3 className="font-semibold break-words w-full md:max-w-[calc(100%-2rem)]">{section.title}</h3>
                        </div>
                        <hr className="border-t border-gray-300 my-3" />
                        <ul>
                          {section.tasks?.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-center space-x-2">
                              <div>
                                <span className="block text-sm font-medium text-gray-800">{task.title}</span>
                                <span className="block text-xs text-gray-600">
                                  {formatDateOnly(new Date(task.startDate))} to {formatDateOnly(new Date(task.endDate))}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                {milestoneIndex < milestones.length - 1 && (
                  <div className="flex justify-center items-center">
                    <div className="w-1 h-12 bg-blue-400"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Box>

      </Modal>
    </Box>
  );
});
