import { Box, Modal } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ScreenTitleName from "../ScreenTitleName";
import { roadmapEditStore } from "../../app/stores/roadmapEditStore";
import { useStore } from "../../app/stores/store";
import { EditRoadmap, RoadmapDto } from "../../services/roadmapEditServices";

interface Task{
  taskId: string; 
  name: string;
  completed: boolean;
  dateStart: string;
  dateEnd: string;
};

interface Section{
  sectionId: string; 
  name: string;
  description: string;
  tasks: Task[];
};

const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

export default observer(function EditStepperThird() {
  const navigate = useNavigate();
  const { roadmapTitle, roadmapDescription, milestones, testingLog } = roadmapEditStore;
  const [openPreview, setOpenPreview] = useState(false);
  const {roadmapStore} = useStore();
  const {selectedRoadmap} = roadmapStore;

  // useEffect(() => {
  //   if (selectedRoadmap) {
  //     roadmapEditStore.roadmapTitle = selectedRoadmap.title || "";
  //     roadmapEditStore.roadmapDescription = selectedRoadmap.description || "";
  //     roadmapEditStore.milestones = selectedRoadmap.milestones || [];
  //   }
  // }, [selectedRoadmap]);

  const handleSubmit = async () => {
    if (!selectedRoadmap) return; 
  
    const roadmapData: RoadmapDto = {
      title: roadmapTitle,
      description: roadmapDescription,
      milestones: selectedRoadmap.milestones.map((milestone) => ({
        milestoneId: milestone.milestoneId,
        name: milestone.name,
        description: milestone.description,
        sections: milestone.sections.map((section: Section) => ({
          sectionId: section.sectionId,
          name: section.name,
          description: section.description,
          tasks: section.tasks.map((task) => ({
            taskId: task.taskId,
            name: task.name,
            dateStart: new Date(task.dateStart).toISOString(),
            dateEnd: new Date(task.dateEnd).toISOString(),
          })),
        })),
      })),
    };
    try 
    {
      console.log("Roadmap data being sent:", roadmapData);
      if(!selectedRoadmap) return 0;
      const result = await EditRoadmap(selectedRoadmap?.roadmapId,roadmapData);
      console.log("Roadmap edited successfully:", result);
      roadmapEditStore.reset();
      navigate('/content');
    } catch (error) {
      console.error("Error editing roadmap:", error);
    }
  };
  
  const handlePreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  
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
      <button onClick={testingLog}>hereTest</button>
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

      {selectedRoadmap?.milestones?.map((milestone, milestoneIndex) => (
        <div key={milestoneIndex} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h6 className="text-2xl font-semibold text-indigo-800">{`Milestone ${milestoneIndex + 1}: ${milestone.name}`}</h6>
            <p className="text-gray-600 text-sm">{milestone.description}</p>
          </div>

          {milestone.sections.map((section: Section, sectionIndex: number) => (
            <div key={sectionIndex} className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-indigo-700">{`Section ${sectionIndex + 1}: ${section.name}`}</p>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>

              {section.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="mt-2 ml-6 p-4 bg-indigo-50 rounded-lg shadow-sm">
                  <div className="flex justify-between">
                    <p className="text-gray-700 font-medium">{`Task ${taskIndex + 1}: ${task.name}`}</p>
                    <p className="text-gray-500 text-xs">{formatDate(task.dateStart)} - {formatDate(task.dateEnd)}</p>
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
          onClick={() => handleSubmit()} 
          className="bg-gray-500 text-white p-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Save Roadmap
        </button>

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
            {selectedRoadmap?.milestones.map((milestone, milestoneIndex) => (
              <div key={milestoneIndex}>
                <div className="p-4 rounded-lg border-2 border-gray-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">{milestone.name}</h2>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {milestone.sections?.map((section: Section, sectionIndex: number) => (
                      <div
                        key={sectionIndex}
                        className="p-4 border rounded-lg bg-gray-100"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <h3 className="font-semibold break-words w-full md:max-w-[calc(100%-2rem)]">{section.name}</h3>
                        </div>
                        <hr className="border-t border-gray-300 my-3" />
                        <ul>
                          {section.tasks?.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-center space-x-2">
                              <div>
                                <span className="block text-sm font-medium text-gray-800">{task.name}</span>
                                <span className="block text-xs text-gray-600">
                                  {formatDate(task.dateStart)} - {formatDate(task.dateEnd)}
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
