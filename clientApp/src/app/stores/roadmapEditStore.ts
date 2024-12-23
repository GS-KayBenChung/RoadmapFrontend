import { makeAutoObservable, runInAction } from "mobx";

class RoadmapEditStore {
  activeStep = 0;
  roadmapTitle = '';
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

  initializeRoadmap = (data: {
    title: string;
    description: string;
    milestones: Array<{
      title: string;
      description: string;
      sections: Array<{
        title: string;
        description: string;
        tasks: Array<{ title: string; startDate: string; endDate: string }>;
      }>;
    }>;
  }) => {
    runInAction(() => {
      console.log(data.title);
      this.roadmapTitle = data.title;
      this.roadmapDescription = data.description;
      this.milestones = data.milestones;
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

  populateFromRoadmap(roadmap: any) {
    this.roadmapTitle = roadmap.title;
    this.roadmapDescription = roadmap.description;
    //console.log("After populating:", this.roadmapTitle, this.roadmapDescription);
  }
}

export const roadmapEditStore = new RoadmapEditStore();