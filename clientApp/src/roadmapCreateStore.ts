import { makeAutoObservable, runInAction } from "mobx";

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
}

export const roadmapCreateStore = new RoadmapCreateStore();
