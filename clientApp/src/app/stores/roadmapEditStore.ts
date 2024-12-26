import { makeAutoObservable, runInAction, toJS } from "mobx";
import { Milestone } from "../../services/roadmapEditServices";

class RoadmapEditStore {
  activeStep = 0;
  roadmapTitle = "";
  roadmapDescription = "";
  milestones = [] as Array<{
    name: string;
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

  testingLog = () => {
    console.log("Milestones:", toJS(roadmapEditStore.milestones));
  }

  setActiveStep = (step: number) => {
    runInAction(() => {
      this.activeStep = step;
    });
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

  setMilestones = (milestones: Milestone[]) => {
    runInAction(() => {
      this.milestones = milestones.map((milestone) => ({
        name: milestone.name || "",
        description: milestone.description || "",
        sections: milestone.sections.map((section) => ({
          title: section.title || "",
          description: section.description || "",
          tasks: section.tasks.map((task) => ({
            title: task.title || "",
            startDate: task.startDate || "",
            endDate: task.endDate || "",
          })),
        })),
      }));
    });
  };
  

  addMilestone = () => {
    runInAction(() => {
      this.milestones.push({
        name: "",
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
}

export const roadmapEditStore = new RoadmapEditStore();