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
      name: string;
      description: string;
      tasks: Array<{ name: string; dateStart: string; dateEnd: string }>;
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
          name: section.name || "",
          description: section.description || "",
          tasks: section.tasks.map((task) => ({
            name: task.name || "",
            dateStart: task.dateStart || "",
            dateEnd: task.dateEnd || "",
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
        name: "",
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
        name: "",
        dateStart: "",
        dateEnd: "",
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

export const roadmapEditStore = new RoadmapEditStore();