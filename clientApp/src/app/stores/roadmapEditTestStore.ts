import { makeAutoObservable, runInAction, toJS } from "mobx";

class RoadmapEditTestStore {
  activeStep = 0;
  roadmapToEdit: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveStep = (step: number) => {
    runInAction(() => {
      this.activeStep = step;
    });
  };

  loadRoadmap(roadmap: any) {
    this.roadmapToEdit = { ...roadmap }; 
  }
  
  updateRoadmap(updatedData: Partial<any>) {
    if (!this.roadmapToEdit) {
      return;
    }
  
    this.roadmapToEdit = { ...this.roadmapToEdit, ...updatedData };
  }
  
  
  handleInputChange = (e: React.ChangeEvent<any>) => {
    if (!this.roadmapToEdit) {
      return;
    }
  
    const { name, value } = e.target;
    this.updateRoadmap({ [name]: value });
  };

  updateMilestoneField = (milestoneId: string, field: string, value: string) => {
    const updatedMilestones = this.roadmapToEdit.milestones.map((milestone: any) =>
      milestone.milestoneId === milestoneId ? { ...milestone, [field]: value } : milestone
    );
    this.roadmapToEdit = { ...this.roadmapToEdit, milestones: updatedMilestones };
  };

  updateSectionField = (milestoneId: string, sectionId: string, field: string, value: string) => {
    const updatedMilestones = this.roadmapToEdit.milestones.map((milestone: any) => {
      if (milestone.milestoneId === milestoneId) {
        const updatedSections = milestone.sections.map((section: any) =>
          section.sectionId === sectionId ? { ...section, [field]: value } : section
        );
        return { ...milestone, sections: updatedSections };
      }
      return milestone;
    });
    this.roadmapToEdit = { ...this.roadmapToEdit, milestones: updatedMilestones };
  };

  updateTaskField = (milestoneId: string, sectionId: string, taskId: string, field: string, value: string) => {
    const updatedMilestones = this.roadmapToEdit.milestones.map((milestone: any) => {
      if (milestone.milestoneId === milestoneId) {
        const updatedSections = milestone.sections.map((section: any) => {
          if (section.sectionId === sectionId) {
            const updatedTasks = section.tasks.map((task: any) =>
              task.taskId === taskId ? { ...task, [field]: value } : task
            );
            return { ...section, tasks: updatedTasks };
          }
          return section;
        });
        return { ...milestone, sections: updatedSections };
      }
      return milestone;
    });
    this.roadmapToEdit = { ...this.roadmapToEdit, milestones: updatedMilestones };
  };

  addMilestone = () => {
    const newMilestone = {
      milestoneId: crypto.randomUUID(),
      name: "",
      description: "",
      sections: [],
      isDeleted: false,
    };
    this.roadmapToEdit.milestones.push(newMilestone);
  };

  addSection = (milestoneId: string) => {
    const updatedMilestones = this.roadmapToEdit.milestones.map((milestone: any) => {
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
    this.roadmapToEdit = { ...this.roadmapToEdit, milestones: updatedMilestones };
  };

  addTask = (milestoneId: string, sectionId: string) => {
    const updatedMilestones = this.roadmapToEdit.milestones.map((milestone: any) => {
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
    this.roadmapToEdit = { ...this.roadmapToEdit, milestones: updatedMilestones };
  };

  // saveChanges = async () => {
  //   try {
  //     const roadmapData = {
  //       title: this.roadmapToEdit.title,
  //       description: this.roadmapToEdit.description,
  //       milestones: this.roadmapToEdit.milestones,
  //     };
  //     await EditRoadmap(this.roadmapToEdit.roadmapId, roadmapData);
  //   } catch (error) {
  //   }
  // };
  
  
  // updateMilestone(milestoneId: string, field: string, value: any) {
  //   const milestone = this.newRoadmap?.milestones?.find(
  //     (m: any) => m.milestoneId === milestoneId
  //   );
  //   if (milestone) {
  //     milestone[field] = value;
  //   }
  // }

  // updateSection(milestoneId: string, sectionId: string, field: string, value: any) {
  //   const milestone = this.newRoadmap?.milestones?.find(
  //     (m: any) => m.milestoneId === milestoneId
  //   );
  //   const section = milestone?.sections?.find((s: any) => s.sectionId === sectionId);
  //   if (section) {
  //     section[field] = value;
  //   }
  // }

  // updateTask(milestoneId: string, sectionId: string, taskId: string, field: string, value: any) {
  //   const milestone = this.newRoadmap?.milestones?.find(
  //     (m: any) => m.milestoneId === milestoneId
  //   );
  //   const section = milestone?.sections?.find((s: any) => s.sectionId === sectionId);
  //   const task = section?.tasks?.find((t: any) => t.taskId === taskId);
  //   if (task) {
  //     task[field] = value;
  //   }
  // }

  reset() {
  }
}

export const roadmapEditTestStore = new RoadmapEditTestStore();