import { makeAutoObservable, runInAction } from "mobx";
import { toast, ToastContainer } from "react-toastify";

class RoadmapCreateStore {
  activeStep = 0;
  roadmapTitle = "";
  roadmapDescription = "";
  milestones = [] as Array<{
    title: string;
    description: string;
    sections: Array<{
      title: string;
      description: string;
      tasks: Array<{ title: string; startDate: string; endDate: string }>;
    }>;
  }>;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveStep = (step: number) => {
    runInAction(() => {
      this.activeStep = step;
    });
  };

  validateRoadmap = (): boolean => {
    if (!this.roadmapTitle.trim() || !this.roadmapDescription.trim()) {
      toast.warning("Roadmap Title and Description are required.");
      return false;
    }
  
    for (let i = 0; i < this.milestones.length; i++) {
      const milestone = this.milestones[i];
      if (!milestone.title.trim() || !milestone.description.trim()) {
        toast.warning(`Milestone ${i + 1} Title and Description are required.`);
        return false;
      }
  
      for (let j = 0; j < milestone.sections.length; j++) {
        const section = milestone.sections[j];
        if (!section.title.trim() || !section.description.trim()) {
          toast.warning(`Section ${j + 1} in Milestone ${i + 1} Title and Description are required.`);
          return false;
        }
  
        for (let k = 0; k < section.tasks.length; k++) {
          const task = section.tasks[k];
          if (!task.title.trim()) {
            toast.warning(`Task ${k + 1} in Section ${j + 1} of Milestone ${i + 1} Title is required.`);
            return false;
          }
          if (!task.startDate || !task.endDate) {
            toast.warning(`Task ${k + 1} in Section ${j + 1} of Milestone ${i + 1} Start Date and End Date are required.`);
            return false;
          }
          if (new Date(task.startDate) > new Date(task.endDate)) {
            toast.warning(`Task ${k + 1} in Section ${j + 1} of Milestone ${i + 1} End Date cannot be before Start Date.`);
            return false;
          }
        }
      }
    }
  
    return true;
  };
  
  setRoadmapTitle = (title: string) => {
    runInAction(() => {
      this.roadmapTitle = title;
    });
  };

  setRoadmapDescription = (description: string) => {
    runInAction(() => {
      this.roadmapDescription = description;
    });
  };

  addMilestone = () => {
    runInAction(() => {
      this.milestones.push({
        title: "",
        description: "",
        sections: [],
      });
    });
  };

  deleteMilestone = (index: number) => {
    runInAction(() => {
      this.milestones.splice(index, 1);
    });
  };

  addSection = (milestoneIndex: number) => {
    runInAction(() => {
      this.milestones[milestoneIndex].sections.push({
        title: "",
        description: "",
        tasks: [],
      });
    });
  };

  deleteSection = (milestoneIndex: number, sectionIndex: number) => {
    runInAction(() => {
      this.milestones[milestoneIndex].sections.splice(sectionIndex, 1);
    });
  };

  addTask = (milestoneIndex: number, sectionIndex: number) => {
    runInAction(() => {
      this.milestones[milestoneIndex].sections[sectionIndex].tasks.push({
        title: "",
        startDate: "",
        endDate: "",
      });
    });
  };

  deleteTask = (milestoneIndex: number, sectionIndex: number, taskIndex: number) => {
    runInAction(() => {
      this.milestones[milestoneIndex].sections[sectionIndex].tasks.splice(taskIndex, 1);
    });
  };

  reset() {
    this.roadmapTitle = "";
    this.roadmapDescription = "";
    this.milestones = [];
    this.activeStep =0;
  }
}

export const roadmapCreateStore = new RoadmapCreateStore();