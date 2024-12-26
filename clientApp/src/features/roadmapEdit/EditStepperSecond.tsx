import { Box, Card, CardContent, IconButton, TextField } from "@mui/material";
import { TrashIcon } from "@heroicons/react/16/solid";
import { runInAction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { roadmapEditStore } from "../../app/stores/roadmapEditStore";
import { useStore } from "../../app/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponent";

interface Task{
  name: string;
  completed: boolean;
  dateStart: string;
  dateEnd: string;
};

interface Section{
  name: string;
  description: string;
  tasks: Task[];
};

const EditStepperSecond = observer(() => {
  const {  addMilestone, deleteMilestone, addSection, deleteSection, addTask, deleteTask, testingLog } = roadmapEditStore;
  const {roadmapStore} = useStore();
  const {selectedRoadmap} = roadmapStore;

  console.log("Selected Roadmap:", selectedRoadmap);
  console.log("Selected Roadmap:", JSON.stringify(toJS(selectedRoadmap), null, 2));

  const milestones = selectedRoadmap?.milestones || [];

  if (!milestones.length) {
    return <div>No milestones available. Please add a milestone or check the roadmap data.</div>;
  }
  if(!selectedRoadmap) return <LoadingComponent/>;
  return (
    <Box className="mb-24">
      <button
        onClick={addMilestone}
        className="mb-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Milestone
      </button>
      <button onClick={testingLog}>hereTest</button>
      {selectedRoadmap.milestones?.map((milestone, milestoneIndex) =>  (
        <Card key={milestoneIndex} className="mb-3 p-2 mt-8 border-2 border-black">
          <CardContent>
            <Box className="flex justify-between">
              <h6 className="font-extrabold text-xl">{milestone.name || `Milestone ${milestoneIndex + 1}`}</h6>
              <IconButton onClick={() => deleteMilestone(milestoneIndex)}>
                <TrashIcon className="h-5 w-5 text-red-600" />
              </IconButton>
            </Box>
            <Box className="flex flex-col items-center">
              <TextField
                fullWidth
                margin="normal"
                label="Milestone Title"
                value={milestone.name}
                onChange={(e) => {
                  runInAction(() => {
                    milestone.name = e.target.value;
                  });
                }}
                className="max-w-[500px]"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Milestone Description"
                multiline
                rows={2}
                value={milestone.description}
                onChange={(e) => {
                  runInAction(() => {
                    milestone.description = e.target.value;
                  });
                }}
                className="max-w-[500px]"
              />
              <button
                onClick={() => addSection(milestoneIndex)}
                className="my-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Section
              </button>

              {milestone.sections?.map((section: Section, sectionIndex: number) => (
                <Card key={sectionIndex} className="w-3/5 mt-3 ml-2 p-3 border border-black text-black rounded">
                  <CardContent>
                    <Box className="flex justify-between">
                      <h6 className="font-extrabold text-xl">{section.name || `Section ${sectionIndex + 1}`}</h6>
                      <IconButton onClick={() => deleteSection(milestoneIndex, sectionIndex)} aria-label="delete section">
                        <TrashIcon className="h-5 w-5 text-red-600" />
                      </IconButton>
                    </Box>
                    <Box className="flex flex-col items-center">
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Section Title"
                        value={section.name}
                        onChange={(e) => {
                          runInAction(() => {
                            section.name = e.target.value;
                          });
                        }}
                        className="max-w-[400px]"
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Section Description"
                        multiline
                        rows={2}
                        value={section.description}
                        onChange={(e) => {
                          runInAction(() => {
                            section.description = e.target.value;
                          });
                        }}
                        className="max-w-[400px]"
                      />
                      <button
                        onClick={() => addTask(milestoneIndex, sectionIndex)}
                        className="my-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add Task
                      </button>
                      {section.tasks.map((task: Task, taskIndex: number) => (
                        <Card key={taskIndex} className="w-3/5 mt-3 ml-2 p-3 border border-black text-black rounded">
                          <CardContent>
                            <Box className="flex justify-between">
                              <h6 className="font-extrabold text-xl">{task.name || `Task ${taskIndex + 1}`}</h6>
                              <IconButton
                                onClick={() => deleteTask(milestoneIndex, sectionIndex, taskIndex)}
                                aria-label="delete task"
                              >
                                <TrashIcon className="h-5 w-5 text-red-600" />
                              </IconButton>
                            </Box>
                            <Box className="flex flex-col items-center">
                              <TextField
                                fullWidth
                                margin="normal"
                                label="Task Title"
                                value={task.name}
                                onChange={(e) => {
                                  runInAction(() => {
                                    task.name = e.target.value;
                                  });
                                }}
                                className="max-w-[400px]"
                              />
                              <TextField
                                margin="normal"
                                type="date"
                                label="Start Date"
                                InputLabelProps={{ shrink: true }}
                                value={task.dateStart ? new Date(task.dateStart).toISOString().split("T")[0] : ""}
                                onChange={(e) =>
                                  runInAction(() => {
                                    task.dateStart = e.target.value;
                                  })
                                }
                                className="w-[400px]"
                              />
                              <TextField
                                margin="normal"
                                type="date"
                                label="End Date"
                                InputLabelProps={{ shrink: true }}
                                value={task.dateEnd ? new Date(task.dateEnd).toISOString().split("T")[0] : ""}
                                onChange={(e) =>
                                  runInAction(() => {
                                    task.dateEnd = e.target.value;
                                  })
                                }
                                className="w-[400px]"
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
});

export default EditStepperSecond;