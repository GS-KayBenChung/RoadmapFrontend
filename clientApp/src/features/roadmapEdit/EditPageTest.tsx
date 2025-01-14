import { TrashIcon } from "@heroicons/react/16/solid";
import { Box, Card, CardContent, IconButton, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
// import { roadmapEditTestStore } from "../../app/stores/roadmapEditTestStore";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Roadmap } from "../../app/models/roadmap";

export default observer(function EditPageTest() {
  const { roadmapStore } = useStore();
  const { loadRoadmap } = roadmapStore;
  const { id } = useParams();
  const [roadmapToEdit, setRoadmapToEdit] = useState<any>(null);
  const navigate = useNavigate();
  const visibleMilestones = roadmapToEdit?.milestones?.filter((m: any) => !m.isDeleted) || [];
  const visibleSections = (sections: any[]) => sections?.filter((s) => !s.isDeleted) || [];
  const visibleTasks = (tasks: any[]) => tasks?.filter((t) => !t.isDeleted) || [];
  
  useEffect(() => {
    if (id) {
      loadRoadmap(id).then((roadmap) => {
        if (roadmap) setRoadmapToEdit(roadmap);
      });
    }
  }, [id, loadRoadmap]);

  const handleFieldChange = (field: string, value: string) => {
    setRoadmapToEdit((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMilestoneChange = (milestoneId: string, field: string, value: string) => {
    setRoadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) =>
        milestone.milestoneId === milestoneId
          ? { ...milestone, [field]: value }
          : milestone
      );
      return { ...prev, milestones: updatedMilestones };
    });
  };

  const handleSectionChange = (milestoneId: string, sectionId: string, field: string, value: string) => {
    setRoadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) => {
        if (milestone.milestoneId === milestoneId) {
          const updatedSections = milestone.sections.map((section: any) =>
            section.sectionId === sectionId
              ? { ...section, [field]: value }
              : section
          );
          return { ...milestone, sections: updatedSections };
        }
        return milestone;
      });
      return { ...prev, milestones: updatedMilestones };
    });
  };

  const handleTaskChange = (
    milestoneId: string,
    sectionId: string,
    taskId: string,
    field: string,
    value: string | null
  ) => {
    setRoadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) => {
        if (milestone.milestoneId === milestoneId) {
          const updatedSections = milestone.sections.map((section: any) => {
            if (section.sectionId === sectionId) {
              const updatedTasks = section.tasks.map((task: any) =>
                task.taskId === taskId
                  ? { ...task, [field]: value }
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
  
  const addMilestone = () => {
    setRoadmapToEdit((prev: any) => {
      const newMilestone = {
        milestoneId: crypto.randomUUID(),
        name: "",
        description: "",
        sections: [],
        isDeleted: false,
      };
      return { ...prev, milestones: [...prev.milestones, newMilestone] };
    });
  };
  
  const addSection = (milestoneId: string) => {
    setRoadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) => {
        if (milestone.milestoneId === milestoneId) {
          const newSection = {
            sectionId: crypto.randomUUID(),
            name: "",
            description: "",
            tasks: [],
            isDeleted: false,
          };
          return { ...milestone, sections: [...milestone.sections, newSection] };
        }
        return milestone;
      });
      return { ...prev, milestones: updatedMilestones };
    });
  };
  
  const addTask = (milestoneId: string, sectionId: string) => {
    setRoadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) => {
        if (milestone.milestoneId === milestoneId) {
          const updatedSections = milestone.sections.map((section: any) => {
            if (section.sectionId === sectionId) {
              const newTask = {
                taskId: crypto.randomUUID(),
                name: "",
                dateStart: null,
                dateEnd: null,
                isCompleted: false,
                isDeleted: false,
              };
              return { ...section, tasks: [...section.tasks, newTask] };
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
  
  const removeMilestone = (milestoneId: string) => {
    setRoadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) =>
        milestone.milestoneId === milestoneId
          ? { ...milestone, isDeleted: true }
          : milestone
      );
      return { ...prev, milestones: updatedMilestones };
    });
  };
  
  const removeSection = (milestoneId: string, sectionId: string) => {
    setRoadmapToEdit((prev: any) => {
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
    setRoadmapToEdit((prev: any) => {
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

  const validateRoadmap = (): boolean => {
    if (!roadmapToEdit?.title?.trim()) {
      toast.error("Roadmap title cannot be empty");
      return false;
    }
  
    if (!roadmapToEdit?.description?.trim()) {
      toast.error("Roadmap description cannot be empty");
      return false;
    }
  
    for (const milestone of roadmapToEdit.milestones) {
      if (milestone.isDeleted) continue;
  
      if (!milestone.name.trim()) {
        toast.error("Milestone title cannot be empty");
        return false;
      }
  
      if (!milestone.description.trim()) {
        toast.error(`Description for milestone "${milestone.name}" cannot be empty`);
        return false;
      }
  
      for (const section of milestone.sections) {
        if (section.isDeleted) continue;
  
        if (!section.name.trim()) {
          toast.error(`Section title in milestone "${milestone.name}" cannot be empty`);
          return false;
        }
  
        if (!section.description.trim()) {
          toast.error(`Description for section "${section.name}" cannot be empty`);
          return false;
        }
  
        const tasks = section.tasks.filter((task: any) => !task.isDeleted);
  
        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
  
          if (!task.name.trim()) {
            toast.error(`Task title in section "${section.name}" cannot be empty`);
            return false;
          }
  
          if (!task.dateStart || !task.dateEnd || task.dateStart.trim() === "" || task.dateEnd.trim() === "") {
            toast.error(`Start and end dates for task "${task.name}" must be set`);
            return false;
          }          
  
          const startDate = new Date(task.dateStart);
          const endDate = new Date(task.dateEnd);
  
          if (startDate.getTime() === endDate.getTime()) {
            toast.error(`Start and end dates cannot be the same for task "${task.name}"`);
            return false;
          }
  
          if (startDate > endDate) {
            toast.error(`Start date cannot be after end date for task "${task.name}"`);
            return false;
          }
  
          if (i < tasks.length - 1) {
            const nextTask = tasks[i + 1];
            const nextStartDate = new Date(nextTask.dateStart);
  
            if (endDate > nextStartDate) {
              toast.error(`End date of "${task.name}" cannot be after start date of "${nextTask.name}"`);
              return false;
            }
          }
        }
      }
    }
  
    return true;
  };

  const saveChanges = async () => {
    const roadmapData = {
      id: roadmapToEdit?.id,
      title: roadmapToEdit?.title,
      description: roadmapToEdit?.description,
      milestones: roadmapToEdit.milestones.map((milestone: any) => ({
        milestoneId: milestone.milestoneId,
        name: milestone.name,
        description: milestone.description,
        isDeleted: milestone.isDeleted || false,
        sections: milestone.sections.map((section: any) => ({
          sectionId: section.sectionId,
          name: section.name,
          description: section.description,
          isDeleted: section.isDeleted || false,
          tasks: section.tasks.map((task: any) => ({
            taskId: task.taskId,
            name: task.name,
            dateStart: new Date(task.dateStart).toISOString(),
            dateEnd: new Date(task.dateEnd).toISOString(),
            isDeleted: task.isDeleted || false,
          })),
        })),
      })),
    };
  
    try {
      if (!validateRoadmap()) {
        return; 
      }
      if (roadmapStore.selectedRoadmap?.roadmapId) {
        await EditRoadmap(roadmapStore.selectedRoadmap.roadmapId, roadmapData);
      } else {
        toast.error("Roadmap ID is missing.");
      }
      toast.success("Roadmap updated successfully!");
      navigate("/content");
    } catch (error: any) {
      if (error.response) {
        toast.error(`Error ${error.response.status}: ${error.response.data.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
      toast.error("Update failed:", error);
    }
  };  

  const EditRoadmap = async (roadmapId: string, roadmapData: Partial<Roadmap>) => {
    try {
      const response = await axios.patch(`/roadmaps/${roadmapId}`, roadmapData);

      console.log("Testing updateRoadmap" + roadmapId + " " + roadmapData);
      
      console.log("Response: " + JSON.stringify(response));
      
      return response.data;
    } catch (error) {
      toast.error("Error editing roadmap:");
      throw error;
    }
  };

  if(!roadmapToEdit) return <LoadingComponent/>;

  return (
    <>
    <ToastContainer
      autoClose={2000}
      hideProgressBar={true}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={true}
      position="top-center"
    />
    <Box className="m-24">
    <button 
      className="my-3 block mx-auto bg-blue-600 text-white py-2 px-4 rounded"
      onClick={saveChanges}>
        SAVE CHANGES  
    </button>
      <div className="flex flex-col items-center p-3">
        <TextField
          fullWidth
          margin="normal"
          label="Roadmap Title"
          name="title"
          value={roadmapToEdit.title || ""}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          inputProps={{ maxLength: 50 }}
          className="max-w-[600px]"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Roadmap Description"
          multiline
          rows={4}
          name="description"
          value={roadmapToEdit.description || ""}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          inputProps={{ maxLength: 100 }}
          className="max-w-[600px]"
        />
      </div>
      <button
         onClick={() => {
          addMilestone();
        }}
        className="mb-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Milestone
      </button>
      {visibleMilestones.map((milestone: any) => (
        <Card key={milestone.milestoneId} className="mb-3 p-2 mt-8 border-2 border-black">
          <CardContent>
            <Box className="flex justify-between">
              <h6 className="font-extrabold text-xl">{milestone.name || "Milestone"}</h6>
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
                      <h6 className="font-extrabold text-xl">{section.name || "Section"}</h6>
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
                              <h6 className="font-extrabold text-xl">{task.name || "Task"}</h6>
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
                                  handleTaskChange(
                                    milestone.milestoneId,
                                    section.sectionId,
                                    task.taskId,
                                    "dateStart",
                                    e.target.value === "" ? null : e.target.value
                                  )
                                  // handleTaskChange(milestone.milestoneId, section.sectionId, task.taskId, "dateStart", e.target.value)
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
                                  handleTaskChange(
                                    milestone.milestoneId,
                                    section.sectionId,
                                    task.taskId,
                                    "dateEnd",
                                    e.target.value === "" ? null : e.target.value
                                  )
                                  // handleTaskChange(milestone.milestoneId, section.sectionId, task.taskId, "dateEnd", e.target.value)
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
    <button 
      className="my-3 block mx-auto bg-blue-600 text-white py-2 px-4 rounded"
      onClick={saveChanges}>
        SAVE CHANGES  
    </button>
    </>
  );
});