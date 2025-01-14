import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../app/api/apiClient";
import { toast } from "react-toastify";

// const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

export default observer(function EditStepperThird() {
  const { roadmapStore } = useStore();
  const { loadRoadmap } = roadmapStore;
  const { id } = useParams();
  const [roadmapToEdit, setRoadmapToEdit] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadRoadmap(id).then((roadmap) => {
        if (roadmap) setRoadmapToEdit(roadmap);
      });
    }
  }, [id, loadRoadmap]);

  const saveChanges = async () => {
    const roadmapData = {
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
      await apiClient.Roadmaps.update(roadmapData);
  
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
  return (
    <>
    <div>test</div>
    <button onClick={saveChanges}>Save Changes</button>
    </>
  );
});