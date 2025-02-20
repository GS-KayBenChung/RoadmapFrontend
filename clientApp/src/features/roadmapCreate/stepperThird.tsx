import { Box, Modal } from "@mui/material";
import { observer } from "mobx-react-lite";
import { roadmapCreateStore } from "../../app/stores/roadmapCreateStore";
import { formatDateOnly } from "../DateTimeFormat";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ScreenTitleName from "../ScreenTitleName";
import { toast } from "react-toastify";
import apiClient from "../../app/api/apiClient";
import axios from "axios";
import { useStore } from "../../app/stores/store";

export default observer(function StepperThird() {
  const { userStore } = useStore();
  const userId = userStore.userId;

  const navigate = useNavigate();
  const { roadmapTitle, roadmapDescription, milestones } = roadmapCreateStore;

  const [openPreview, setOpenPreview] = useState(false);

  const calculateOverallDuration = () => {
    if (milestones.length === 0) return 0;
  
    const allTasks = milestones.flatMap(milestone => 
      milestone.sections.flatMap(section => section.tasks)
    );
  
    if (allTasks.length === 0) return 0;
  
    const startDates = allTasks.map(task => new Date(task.startDate));
    const endDates = allTasks.map(task => new Date(task.endDate));
  
    const minStartDate = new Date(Math.min(...startDates.map(date => date.getTime())));
    const maxEndDate = new Date(Math.max(...endDates.map(date => date.getTime())));
  
    const durationInMilliseconds = maxEndDate.getTime() - minStartDate.getTime();
    const durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
  
    return durationInDays;
  };
  

  const handleSubmit = async (isDraft: boolean) => {
    if (!userId) {
      toast.error("You must be logged in to create a roadmap.");
      return;
    }
    const roadmapData: any = {
      title: roadmapTitle,
      description: roadmapDescription,
      createdBy: userId,
      createdAt: new Date().toISOString(), 
      overallDuration: calculateOverallDuration(), 
      isDraft: isDraft, 
      milestones: milestones.map((milestone) => ({
        name: milestone.title,
        description: milestone.description,
        sections: milestone.sections.map((section) => ({
          name: section.title,
          description: section.description,
          tasks: section.tasks.map((task) => ({
            name: task.title,
            dateStart: new Date(task.startDate).toISOString(), 
            dateEnd: new Date(task.endDate).toISOString(),
          })),
        })),
      })),
    };

    const logData = {
      userId: userId,  
      activityAction: isDraft 
        ? `Created draft roadmap: ${roadmapTitle}` 
        : `Created published roadmap: ${roadmapTitle}`,  
    };
        
    try {
      await apiClient.Roadmaps.create(roadmapData);
      await apiClient.Roadmaps.createLog(logData);
      toast.success("Roadmap created successfully!");
      roadmapCreateStore.reset();
      navigate('/content');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "An error occurred.";
        toast.error(`Error ${status}: ${message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
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
                <h1 className="text-xl font-bold leading-none flex-shrink-0">Roadmap : {roadmapTitle}</h1>
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
                        <h2 className="text-lg font-bold">Milestone: {milestone.title}</h2>
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
                          <h3 className="font-semibold break-words w-full md:max-w-[calc(100%-2rem)]">Section: {section.title}</h3>
                        </div>
                        <hr className="border-t border-gray-300 my-3" />
                        <ul>
                          {section.tasks?.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-center space-x-2">
                              <div>
                                <span className="block text-sm font-medium text-gray-800">Task: {task.title}</span>
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
