import { TrashIcon } from "@heroicons/react/16/solid";
import { Box, Card, CardContent, IconButton, TextField, Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { roadmapEditTestStore } from "../../app/stores/roadmapEditTestStore";
import { toast } from "react-toastify";


export default observer(function EditStepperSecond() {
  const { loadRoadmap, roadmapToEdit, updateRoadmap, addMilestone, addSection, addTask } = roadmapEditTestStore;
  const { id } = useParams();
  
  const visibleMilestones = roadmapToEdit?.milestones?.filter((m: any) => !m.isDeleted) || [];
  const visibleSections = (sections: any[]) => sections?.filter((s) => !s.isDeleted) || [];
  const visibleTasks = (tasks: any[]) => tasks?.filter((t) => !t.isDeleted) || [];

  const [daysToAdd, setDaysToAdd] = useState<number | null>(null);

  const handleDateChange = (milestoneId: string, sectionId: string, taskId: string, field: string, value: string, isStartDate: boolean) => {
    const milestone = roadmapToEdit.milestones.find((m: any) => m.milestoneId === milestoneId);
    const section = milestone?.sections.find((s: any) => s.sectionId === sectionId);
    const task = section?.tasks.find((t: any) => t.taskId === taskId);
  
    if (task) {
      task[field] = value;
      
      if (isStartDate || field === 'dateEnd') {
        const shouldAddDays = window.confirm("Do you want to add days to all subsequent tasks?");
        if (shouldAddDays) {
          const numberOfDays = prompt("How many days would you like to add to the subsequent tasks?", "1");
          if (numberOfDays && !isNaN(Number(numberOfDays))) {
            setDaysToAdd(Number(numberOfDays));
            updateSubsequentTaskDates(milestoneId, sectionId, taskId, Number(numberOfDays));
          }
        }
      }
  
      updateRoadmap({ milestones: roadmapToEdit.milestones });
    }
  };

  const updateSubsequentTaskDates = (milestoneId: string, sectionId: string, taskId: string, daysToAdd: number) => {
    const milestone = roadmapToEdit.milestones.find((m: any) => m.milestoneId === milestoneId);
    const section = milestone?.sections.find((s: any) => s.sectionId === sectionId);
    const taskIndex = section?.tasks.findIndex((t: any) => t.taskId === taskId);
  
    if (taskIndex !== undefined && taskIndex !== -1) {
      for (let i = taskIndex + 1; i < section.tasks.length; i++) {
        const task = section.tasks[i];
        
        if (task.dateStart) {
          task.dateStart = addDaysToDate(task.dateStart, daysToAdd);
        }
        if (task.dateEnd) {
          task.dateEnd = addDaysToDate(task.dateEnd, daysToAdd);
        }
      }
    }
  
    updateRoadmap({ milestones: roadmapToEdit.milestones });
  };

  const addDaysToDate = (date: string, days: number): string => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate.toISOString().split("T")[0];
  };
  
  useEffect(() => {
    if (id) {
      loadRoadmap(id);
    }
  }, [id, loadRoadmap]);

  const handleMilestoneChange = (milestoneId: string, field: string, value: string) => {
    const milestone = roadmapToEdit.milestones.find((m: any) => m.milestoneId === milestoneId);
    if (milestone) {
      milestone[field] = value;
      updateRoadmap({ milestones: roadmapToEdit.milestones });
    }
  };

  const handleSectionChange = (milestoneId: string, sectionId: string, field: string, value: string) => {
    const milestone = roadmapToEdit.milestones.find((m: any) => m.milestoneId === milestoneId);
    const section = milestone?.sections.find((s: any) => s.sectionId === sectionId);
    if (section) {
      section[field] = value;
      updateRoadmap({ milestones: roadmapToEdit.milestones });
    }
  };

  const handleTaskChange = (milestoneId: string, sectionId: string, taskId: string, field: string, value: string) => {
    if (field === "dateStart" || field === "dateEnd") {
      handleDateChange(milestoneId, sectionId, taskId, field, value, field === "dateStart");
    } else {
      const milestone = roadmapToEdit.milestones.find((m: any) => m.milestoneId === milestoneId);
      const section = milestone?.sections.find((s: any) => s.sectionId === sectionId);
      const task = section?.tasks.find((t: any) => t.taskId === taskId);
      if (task) {
        task[field] = value;
        updateRoadmap({ milestones: roadmapToEdit.milestones });
      }
    }
  };

  const removeMilestone = (milestoneId: string) => {
    roadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) =>
        milestone.milestoneId === milestoneId
          ? { ...milestone, isDeleted: true }
          : milestone
      );
      return { ...prev, milestones: updatedMilestones };
    });
  };
  
  const removeSection = (milestoneId: string, sectionId: string) => {
    roadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) => {
        if (milestone.milestoneId === milestoneId) {
          const updatedSections = milestone.sections.map((section: any) =>
            section.sectionId === sectionId
              ? { ...section, isDeleted: true }
              : section
          );
          return { ...milestone, sections: updatedSections };
        }
        return milestone;
      });
      return { ...prev, milestones: updatedMilestones };
    });
  };
  
  const removeTask = (milestoneId: string, sectionId: string, taskId: string) => {
    roadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) => {
        if (milestone.milestoneId === milestoneId) {
          const updatedSections = milestone.sections.map((section: any) => {
            if (section.sectionId === sectionId) {
              const updatedTasks = section.tasks.map((task: any) =>
                task.taskId === taskId
                  ? { ...task, isDeleted: true }
                  : task
              );
              return { ...section, tasks: updatedTasks };
            }
            return section;
          });
          return { ...milestone, sections: updatedSections };
        }
        return milestone;
      });
      return { ...prev, milestones: updatedMilestones };
    });
  };

  const saveChanges = async () => {
    try {
      // await roadmapEditTestStore.saveRoadmap();
    } catch (error) {
      toast.error("Failed to save roadmap:");
    }
  };

  if (!roadmapToEdit) return <LoadingComponent />;

  return (
    <>
      <Box className="mb-24">
        <button
          onClick={addMilestone}
          className="mb-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Milestone
        </button>
        {visibleMilestones.map((milestone: any) => (
        <Card key={milestone.milestoneId} className="mb-3 p-2 mt-8 border-2 border-black">
          <CardContent>
            <Box className="flex justify-between">
              <h6 className="font-extrabold text-xl">{milestone.name || `Milestone ${milestone.milestoneId}`}</h6>
              <IconButton onClick={() => removeMilestone(milestone.milestoneId)}>
                <TrashIcon className="h-5 w-5 text-red-600" />
              </IconButton>
            </Box>
            <Box className="flex flex-col items-center">
              <TextField
                fullWidth
                margin="normal"
                label="Milestone Title"
                value={milestone.name || ""}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => handleMilestoneChange(milestone.milestoneId, "name", e.target.value)}
                className="max-w-[500px]"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Milestone Description"
                multiline
                rows={3}
                value={milestone.description || ""}
                inputProps={{ maxLength: 250 }}
                onChange={(e) => handleMilestoneChange(milestone.milestoneId, "description", e.target.value)}
                className="max-w-[500px]"
              />
              <button
                onClick={() => addSection(milestone.milestoneId)}
                className="my-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Section
              </button>

              {visibleSections(milestone.sections).map((section: any) => (
                <Card key={section.sectionId} className="w-3/5 mt-3 ml-2 p-3 border border-black text-black rounded">
                  <CardContent>
                    <Box className="flex justify-between">
                      <h6 className="font-extrabold text-xl">{section.name || `Section ${section.sectionId}`}</h6>
                      <IconButton
                        onClick={() => removeSection(milestone.milestoneId, section.sectionId)}
                        aria-label="delete section"
                      >
                        <TrashIcon className="h-5 w-5 text-red-600" />
                      </IconButton>
                    </Box>
                    <Box className="flex flex-col items-center">
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Section Title"
                        value={section.name || ""}
                        inputProps={{ maxLength: 50 }}
                        onChange={(e) => handleSectionChange(milestone.milestoneId, section.sectionId, "name", e.target.value)}
                        className="max-w-[400px]"
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Section Description"
                        multiline
                        rows={2}
                        value={section.description || ""}
                        inputProps={{ maxLength: 100 }}
                        onChange={(e) => handleSectionChange(milestone.milestoneId, section.sectionId, "description", e.target.value)}
                        className="max-w-[400px]"
                      />
                      <button
                        onClick={() => addTask(milestone.milestoneId, section.sectionId)}
                        className="my-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add Task
                      </button>
                      {visibleTasks(section.tasks).map((task: any) => (
                        <Card key={task.taskId} className="w-3/5 mt-3 ml-2 p-3 border border-black text-black rounded">
                          <CardContent>
                            <Box className="flex justify-between">
                              <h6 className="font-extrabold text-xl">{task.name || `Task ${task.taskId}`}</h6>
                              <IconButton
                                onClick={() => removeTask(milestone.milestoneId, section.sectionId, task.taskId)}
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
                                value={task.name || ""}
                                inputProps={{ maxLength: 50 }}
                                onChange={(e) =>
                                  handleTaskChange(milestone.milestoneId, section.sectionId, task.taskId, "name", e.target.value)
                                }
                                className="max-w-[400px]"
                              />
                              <TextField
                                margin="normal"
                                type="date"
                                label="Start Date"
                                InputLabelProps={{ shrink: true }}
                                
                                value={task.dateStart ? new Date(task.dateStart).toISOString().split("T")[0] : ""}
                                onChange={(e) =>
                                  handleTaskChange(milestone.milestoneId, section.sectionId, task.taskId, "dateStart", e.target.value)
                                }
                                className="max-w-[400px]"
                              />
                              <TextField
                                margin="normal"
                                type="date"
                                label="End Date"
                                InputLabelProps={{ shrink: true }}
                                value={task.dateEnd ? new Date(task.dateEnd).toISOString().split("T")[0] : ""}
                                onChange={(e) =>
                                  handleTaskChange(milestone.milestoneId, section.sectionId, task.taskId, "dateEnd", e.target.value)
                                }
                                className="max-w-[400px]"
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
      <Button onClick={saveChanges}>SAVE CHANGES</Button>
    </>
  );
});
