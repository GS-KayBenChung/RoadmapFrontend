import { TrashIcon } from "@heroicons/react/16/solid";
import { Box, Card, CardContent, IconButton, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import { toast, ToastContainer } from "react-toastify";
import NavBar from "../../app/layout/NavBar";
import apiClient from "../../app/api/apiClient";
import ConfirmModal from "../../app/layout/ConfirmationModel";

export default observer(function EditPageTest() {
  const { userStore } = useStore();
  const userId = userStore.userId;
  const { roadmapStore } = useStore();
  const { loadRoadmap } = roadmapStore;
  const { id } = useParams();
  const [roadmapToEdit, setRoadmapToEdit] = useState<any>(null);
  const navigate = useNavigate();
  const visibleMilestones = roadmapToEdit?.milestones?.filter((m: any) => !m.isDeleted) || [];
  const visibleSections = (sections: any[]) => sections?.filter((s) => !s.isDeleted) || [];
  const visibleTasks = (tasks: any[]) => tasks?.filter((t) => !t.isDeleted) || [];
  const [changesPayload, setChangesPayload] = useState<any>({
    roadmap: {},
    milestones: [],
    sections: [],
    tasks: []
  });
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: "adjust"; 
    dateDifference: number;
    milestoneId: string;
    sectionId: string;
    taskId: string;
    field: string;
    updatedValue: string | null; 
  }>({
    isOpen: false,
    actionType: "adjust",
    dateDifference: 0,
    milestoneId: "",
    sectionId: "",
    taskId: "",
    field: "",
    updatedValue: null, 
  });
  
  useEffect(() => {
    if (id) {
      loadRoadmap(id).then((roadmap) => {
        if (roadmap) setRoadmapToEdit(roadmap);
      });
    }
  }, [id, loadRoadmap]);

  const recordChange = (entity: string, id: string, field: string, value: any, parentIds?: { milestoneId?: string, sectionId?: string, dateStart?: string, dateEnd?: string }) => {
    setChangesPayload((prev: any) => {
      const updatedPayload = { ...prev };
  
      if (entity === 'roadmap') {
        updatedPayload.roadmap[field] = value;
      } else {
        const targetArray = updatedPayload[entity];
        const existingItemIndex = targetArray.findIndex((item: any) => item[`${entity.slice(0, -1)}Id`] === id);
        
        if (existingItemIndex !== -1) {
          targetArray[existingItemIndex][field] = value;
        } else {
          const newItem = { [`${entity.slice(0, -1)}Id`]: id, [field]: value, ...parentIds };
          targetArray.push(newItem);
        }
      }
      return updatedPayload;
    });
  };
  
  const handleFieldChange = (field: string, value: string) => {
    recordChange('roadmap', roadmapStore.selectedRoadmap?.roadmapId || '', field, value);
    
    setRoadmapToEdit((prev: any) => ({
      ...prev,
      [field]: value,
    }));

  };

  const handleMilestoneChange = (milestoneId: string, field: string, value: string) => {

    recordChange('milestones', milestoneId, field, value);

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
    recordChange('sections', sectionId, field, value, { milestoneId });
  
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
    let updatedValue = value;
    let dateDifference: number | null = null;
  
    if (field === "dateStart" || field === "dateEnd") {
      if (value) {
        const newDate = new Date(value);
        updatedValue = newDate.toISOString();
  
        const currentTask = getCurrentTask(milestoneId, sectionId, taskId);
        const currentDate = currentTask[field] ? new Date(currentTask[field]) : null;
  
        if (currentDate && !isNaN(currentDate.getTime())) {
          dateDifference = Math.floor(
            (newDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
          );
        } else {
          dateDifference = 0;
        }
  
        if (dateDifference !== 0) {
          const hasExistingTasks = roadmapToEdit.milestones.some((milestone: any) =>
            milestone.sections.some((section: any) =>
              section.tasks.some(
                (task: any) =>
                  task.taskId !== taskId &&
                  task.dateStart &&
                  task.dateEnd
              )
            )
          );
  
          if (hasExistingTasks) {
            setModalState({
              isOpen: true,
              actionType: "adjust",
              dateDifference,
              milestoneId,
              sectionId,
              taskId,
              field,
              updatedValue,
            });
            return;
          }
        }
      } else {
        updatedValue = null;
      }
    }
  
    // If no modal is triggered, apply the change immediately
    applyTaskChange(milestoneId, sectionId, taskId, field, updatedValue, dateDifference, false);
  };
  
  const applyTaskChange = (
    milestoneId: string,
    sectionId: string,
    taskId: string,
    field: string,
    updatedValue: string | null,
    dateDifference: number | null,
    skipSubsequentUpdate: boolean = false
  ) => {
    recordChange("tasks", taskId, field, updatedValue, { milestoneId, sectionId });
  
    setRoadmapToEdit((prev: any) => {
      const updatedMilestones = prev.milestones.map((milestone: any) => {
        if (milestone.milestoneId === milestoneId) {
          return {
            ...milestone,
            sections: milestone.sections.map((section: any) => {
              if (section.sectionId !== sectionId) return section;
  
              return {
                ...section,
                tasks: section.tasks.map((task: any) => {
                  if (task.taskId === taskId) {
                    let updatedTask = { ...task, [field]: updatedValue };
  
                    // **Fix: Only update End Date if the user confirms shifting subsequent tasks**
                    if (!skipSubsequentUpdate && field === "dateStart" && task.dateEnd && dateDifference) {
                      updatedTask.dateEnd = new Date(
                        new Date(task.dateEnd).getTime() + dateDifference * 24 * 60 * 60 * 1000
                      ).toISOString();
                      recordChange("tasks", taskId, "dateEnd", updatedTask.dateEnd, { milestoneId, sectionId });
                    }
  
                    return updatedTask;
                  }
                  return task;
                }),
              };
            }),
          };
        }
        return milestone;
      });
  
      return { ...prev, milestones: updatedMilestones };
    });
  
    // **Fix: Only shift subsequent tasks if the user confirms**
    if (!skipSubsequentUpdate && dateDifference && dateDifference !== 0) {
      updateSubsequentTasks(milestoneId, sectionId, taskId, dateDifference);
    }
  };
  
  // const updateSubsequentTasks = (
  //   milestoneId: string,
  //   sectionId: string,
  //   taskId: string,
  //   dateDifference: number
  // ) => {
  //   let taskFound = false;
  
  //   setRoadmapToEdit((prev: any) => {
  //     const updatedMilestones = prev.milestones.map((milestone: any) => ({
  //       ...milestone,
  //       sections: milestone.sections.map((section: any) => {
  //         if (section.sectionId !== sectionId) return section;
  
  //         return {
  //           ...section,
  //           tasks: section.tasks.map((task: any) => {
  //             if (taskFound) {
  //               let updatedTask = { ...task };
  
  //               if (updatedTask.dateStart) {
  //                 updatedTask.dateStart = new Date(
  //                   new Date(updatedTask.dateStart).getTime() +
  //                     dateDifference * 24 * 60 * 60 * 1000
  //                 ).toISOString();
  //               }
  //               if (updatedTask.dateEnd) {
  //                 updatedTask.dateEnd = new Date(
  //                   new Date(updatedTask.dateEnd).getTime() +
  //                     dateDifference * 24 * 60 * 60 * 1000
  //                 ).toISOString();
  //               }
  
  //               recordChange("tasks", updatedTask.taskId, "dateStart", updatedTask.dateStart, { milestoneId, sectionId });
  //               recordChange("tasks", updatedTask.taskId, "dateEnd", updatedTask.dateEnd, { milestoneId, sectionId });
  
  //               return updatedTask;
  //             }
  
  //             if (task.taskId === taskId) {
  //               taskFound = true; // Start shifting tasks after this one
  //             }
  
  //             return task;
  //           }),
  //         };
  //       }),
  //     }));
  
  //     return { ...prev, milestones: updatedMilestones };
  //   });
  // };

  const updateSubsequentTasks = (
    milestoneId: string,
    sectionId: string,
    taskId: string,
    dateDifference: number
  ) => {
    let taskFound = false;
  
    setRoadmapToEdit((prev: any) => {
      if (!prev?.milestones) return prev;
  
      // Step 1: Flatten all tasks with milestoneId, sectionId, and ordering
      let allTasks: any[] = [];
      prev.milestones.forEach((milestone: any) => {
        milestone.sections.forEach((section: any) => {
          section.tasks.forEach((task: any) => {
            allTasks.push({
              milestoneId: milestone.milestoneId,  // ✅ Ensure milestoneId is included
              sectionId: section.sectionId,
              taskId: task.taskId,
              dateStart: task.dateStart,
              dateEnd: task.dateEnd,
            });
          });
        });
      });
  
      // Step 2: Sort all tasks based on their start date to process them in order
      allTasks.sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  
      // Step 3: Apply the date shift to subsequent tasks
      return {
        ...prev,
        milestones: prev.milestones.map((milestone: any) => ({
          ...milestone,
          sections: milestone.sections.map((section: any) => ({
            ...section,
            tasks: section.tasks.map((task: any) => {
              if (taskFound) {
                let updatedTask = { ...task };
  
                if (updatedTask.dateStart) {
                  updatedTask.dateStart = new Date(
                    new Date(updatedTask.dateStart).getTime() + dateDifference * 24 * 60 * 60 * 1000
                  ).toISOString();
                }
                if (updatedTask.dateEnd) {
                  updatedTask.dateEnd = new Date(
                    new Date(updatedTask.dateEnd).getTime() + dateDifference * 24 * 60 * 60 * 1000
                  ).toISOString();
                }
  
                // ✅ Ensure milestoneId is recorded properly
                recordChange("tasks", updatedTask.taskId, "dateStart", updatedTask.dateStart, {
                  milestoneId: milestone.milestoneId,
                  sectionId: updatedTask.sectionId,
                });
                recordChange("tasks", updatedTask.taskId, "dateEnd", updatedTask.dateEnd, {
                  milestoneId: milestone.milestoneId,
                  sectionId: updatedTask.sectionId,
                });
  
                return updatedTask;
              }
  
              if (task.taskId === taskId) {
                taskFound = true; // Start shifting tasks after this one
              }
  
              return task;
            }),
          })),
        })),
      };
    });
  };

  const getCurrentTask = (milestoneId: string, sectionId: string, taskId: string) => {
    const milestone = roadmapToEdit.milestones.find((m: any) => m.milestoneId === milestoneId);
    if (!milestone) return null;
    const section = milestone.sections.find((s: any) => s.sectionId === sectionId);
    if (!section) return null;
    return section.tasks.find((t: any) => t.taskId === taskId);
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

  const removeTask = (milestoneId: string, sectionId: string, taskId: string) => {
    const milestone = roadmapToEdit?.milestones.find((m: any) => m.milestoneId === milestoneId);
    const section = milestone?.sections.find((s: any) => s.sectionId === sectionId);
    const task = section?.tasks.find((t: any) => t.taskId === taskId);

    if (task && !task.name && !task.dateStart && !task.dateEnd) {
      setRoadmapToEdit((prev: any) => ({
        ...prev,
        milestones: prev.milestones.map((m: any) =>
          m.milestoneId === milestoneId? {
            ...m,
            sections: m.sections.map((s: any) =>
              s.sectionId === sectionId? { ...s, tasks: s.tasks.filter((t: any) => t.taskId !== taskId) }
              : s
            ),
            }
          : m
        ),
      }));
      return; 
    }

    recordChange("tasks", taskId, "isDeleted", true, {
      milestoneId,
      sectionId,
      dateStart: task.dateStart, 
      dateEnd: task.dateEnd,
    });

    setRoadmapToEdit((prev: any) => ({
        ...prev,
        milestones: prev.milestones.map((m: any) =>
            m.milestoneId === milestoneId
                ? {
                      ...m,
                      sections: m.sections.map((s: any) =>
                          s.sectionId === sectionId
                              ? {
                                    ...s,
                                    tasks: s.tasks.map((t: any) =>
                                        t.taskId === taskId ? { ...t, isDeleted: true } : t
                                    ),
                                }
                              : s
                      ),
                  }
                : m
        ),
    }));
  };

  const removeSection = (milestoneId: string, sectionId: string) => {
    const milestone = roadmapToEdit?.milestones.find((m: any) => m.milestoneId === milestoneId);
    const section = milestone?.sections.find((s: any) => s.sectionId === sectionId);

    if (section && !section.name && !section.description && (!section.tasks || section.tasks.length === 0)) {
        setRoadmapToEdit((prev: any) => ({
            ...prev,
            milestones: prev.milestones.map((m: any) =>
                m.milestoneId === milestoneId
                    ? { ...m, sections: m.sections.filter((s: any) => s.sectionId !== sectionId) }
                    : m
            ),
        }));
        return; 
    }

    recordChange("sections", sectionId, "isDeleted", true, { milestoneId });

    setRoadmapToEdit((prev: any) => ({
        ...prev,
        milestones: prev.milestones.map((m: any) =>
            m.milestoneId === milestoneId
                ? {
                      ...m,
                      sections: m.sections.map((s: any) =>
                          s.sectionId === sectionId ? { ...s, isDeleted: true } : s
                      ),
                  }
                : m
        ),
    }));
  };

  const removeMilestone = (milestoneId: string) => {
    const milestone = roadmapToEdit?.milestones.find((m: any) => m.milestoneId === milestoneId);

    if (milestone && !milestone.name && !milestone.description && (!milestone.sections || milestone.sections.length === 0)) {
        setRoadmapToEdit((prev: any) => ({
            ...prev,
            milestones: prev.milestones.filter((m: any) => m.milestoneId !== milestoneId),
        }));
        return; 
    }

    recordChange("milestones", milestoneId, "isDeleted", true);

    setRoadmapToEdit((prev: any) => ({
        ...prev,
        milestones: prev.milestones.map((m: any) =>
            m.milestoneId === milestoneId ? { ...m, isDeleted: true } : m
        ),
    }));
  };

  const validateRoadmap = (): boolean => {
    if (!roadmapToEdit?.title || typeof roadmapToEdit.title !== "string" || roadmapToEdit.title.trim() === "") {
      toast.error("Roadmap title cannot be empty");
      return false;
    }
  
    if (!roadmapToEdit?.description || typeof roadmapToEdit.description !== "string" || roadmapToEdit.description.trim() === "") {
      toast.error("Roadmap description cannot be empty");
      return false;
    }
  
    let lastTaskEndDate: Date | null = null;
    for (const milestone of roadmapToEdit.milestones || []) {
      if (milestone.isDeleted) continue;
  
      if (!milestone.name || typeof milestone.name !== "string" || milestone.name.trim() === "") {
        toast.error("Milestone title cannot be empty");
        return false;
      }
  
      if (!milestone.description || typeof milestone.description !== "string" || milestone.description.trim() === "") {
        toast.error(`Description for milestone "${milestone.name}" cannot be empty`);
        return false;
      }
  
      for (const section of milestone.sections || []) {
        if (section.isDeleted) continue;
  
        if (!section.name || typeof section.name !== "string" || section.name.trim() === "") {
          toast.error(`Section title in milestone "${milestone.name}" cannot be empty`);
          return false;
        }
  
        if (!section.description || typeof section.description !== "string" || section.description.trim() === "") {
          toast.error(`Description for section "${section.name}" cannot be empty`);
          return false;
        }
  
        const tasks = section.tasks?.filter((task: any) => !task.isDeleted) || [];
  
        for (const task of tasks) {
          if (!task.name || typeof task.name !== "string" || task.name.trim() === "") {
            toast.error(`Task title in section "${section.name}" cannot be empty`);
            return false;
          }
  
          if (!task.dateStart || !task.dateEnd || typeof task.dateStart !== "string" || typeof task.dateEnd !== "string") {
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
  
          if (lastTaskEndDate && startDate < lastTaskEndDate) {
            toast.error(`Start date of task "${task.name}" cannot be before the end date of the previous task`);
            return false;
          }
  
          lastTaskEndDate = endDate;
        }
      }
    }
  
    return true;
  };
  
  const EditRoadmap = async (roadmapId: string, roadmapData: any) => {
    if (!userId) {
      toast.error("You must be logged in to create a roadmap.");
      return;
    }
    const logData = {
      userId: userId,  
      activityAction: roadmapToEdit.isDraft 
        ? `Updated draft roadmap: ${roadmapToEdit.title}` 
        : `Updated published roadmap: ${roadmapToEdit.title}`,  
    };

    try {
      await apiClient.Roadmaps.updateTestRoadmap(roadmapId, roadmapData);
      await apiClient.Roadmaps.createLog(logData);
    } catch (error) {
      toast.error("Error editing roadmap");
      throw error;
    }
  };  

  const handleSubmit = async () => {
    
    if(!validateRoadmap()) return;
    EditRoadmap(roadmapStore.selectedRoadmap?.roadmapId || '', changesPayload)
    .then(() => {
      toast.success("Roadmap saved successfully");
      navigate(`/roadmap/${roadmapStore.selectedRoadmap?.roadmapId}`);
    })
    .catch((error) => {
      toast.error(error);
    });
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
    <NavBar/>
    <Box className="m-24">
      <button 
        className="my-3 block mx-auto bg-blue-600 text-white py-2 px-4 rounded"
        onClick={handleSubmit}
      >
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
          disabled = {!roadmapToEdit?.isDraft}
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
          disabled = {!roadmapToEdit?.isDraft}
        />
      </div>

      {roadmapToEdit?.isDraft && (
      <button
         onClick={() => {
          addMilestone();
        }}
        className="mb-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Milestone
      </button>
      )}
      
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
                disabled = {!roadmapToEdit?.isDraft}
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
                disabled = {!roadmapToEdit?.isDraft}
              />

              {roadmapToEdit?.isDraft && (
              <button
                onClick={() => addSection(milestone.milestoneId)}
                className="my-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Section
              </button>
              )}

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
                        disabled = {!roadmapToEdit?.isDraft}
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
                        disabled = {!roadmapToEdit?.isDraft}
                      />

                      {roadmapToEdit?.isDraft && (
                      <button
                        onClick={() => addTask(milestone.milestoneId, section.sectionId)}
                        className="my-3 block mx-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add Task
                      </button>
                      )}

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
                                disabled = {!roadmapToEdit?.isDraft}
                              />
                              <TextField
                                margin="normal"
                                type="date"
                                label="Start Date"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                  min: new Date().toISOString().split('T')[0], 
                                }}
                                onKeyDown={(e) => e.preventDefault()}
                                value={task.dateStart ? new Date(task.dateStart).toISOString().split("T")[0] : ""}
                                onChange={(e) =>
                                  handleTaskChange(
                                    milestone.milestoneId,
                                    section.sectionId,
                                    task.taskId,
                                    "dateStart",
                                    e.target.value === "" ? null : e.target.value
                                  )
                                }
                                className="max-w-[400px]"
                              />
                              <TextField
                                margin="normal"
                                type="date"
                                label="End Date"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                  min: new Date().toISOString().split('T')[0], 
                                }}
                                onKeyDown={(e) => e.preventDefault()}
                                value={task.dateEnd ? new Date(task.dateEnd).toISOString().split("T")[0] : ""}
                                onChange={(e) =>
                                  handleTaskChange(
                                    milestone.milestoneId,
                                    section.sectionId,
                                    task.taskId,
                                    "dateEnd",
                                    e.target.value === "" ? null : e.target.value
                                  )
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
      onClick={handleSubmit}>
        SAVE CHANGES  
    </button>
    {/* {modalState.isOpen && (
        <ConfirmModal
          isOpen={modalState.isOpen}
          actionType="adjustDate"
          onConfirm={() => {
            applyTaskChange(
              modalState.milestoneId,
              modalState.sectionId,
              modalState.taskId,
              modalState.field,
              modalState.updatedValue,
              modalState.dateDifference
            );
            setModalState({ ...modalState, isOpen: false });
          }}
          onCancel={() => setModalState({ ...modalState, isOpen: false })}
        />
    )} */}
    {modalState.isOpen && (
      <ConfirmModal
        isOpen={modalState.isOpen}
        actionType="adjustDate"
        message={`Do you want to shift all subsequent tasks by ${modalState.dateDifference} days?`}
        confirmText="Shift Dates"
        onConfirm={() => {
          applyTaskChange(
            modalState.milestoneId,
            modalState.sectionId,
            modalState.taskId,
            modalState.field,
            modalState.updatedValue,
            modalState.dateDifference,
            false 
          );
          setModalState({ ...modalState, isOpen: false });
        }}
        onCancel={() => {
          applyTaskChange(
            modalState.milestoneId,
            modalState.sectionId,
            modalState.taskId,
            modalState.field,
            modalState.updatedValue,
            modalState.dateDifference,
            true 
          );
          setModalState({ ...modalState, isOpen: false });
        }}
      />
    )}
    </>
  );
});