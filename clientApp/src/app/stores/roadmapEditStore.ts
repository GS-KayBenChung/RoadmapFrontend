// import { makeAutoObservable, runInAction, toJS } from "mobx";
// import { Milestone } from "../../services/roadmapEditServices";
// import { toast } from "react-toastify";

// class RoadmapEditStore {
//   activeStep = 0;
//   roadmapTitle = "";
//   roadmapDescription = "";
//   milestones = [] as Array<{
//     name: string;
//     description: string;
//     sections: Array<{
//       name: string;
//       description: string;
//       tasks: Array<{ name: string; dateStart: string; dateEnd: string }>;
//     }>;
//   }>;

//   constructor() {
//     makeAutoObservable(this);
//   }

//   // validateRoadmap = (): boolean => {
//   //   if (!this.roadmapTitle.trim() || !this.roadmapDescription.trim()) {
//   //     toast.warning("Roadmap Title and Description are required.");
//   //     return false;
//   //   }
  
//   //   for (let i = 0; i < this.milestones.length; i++) {
//   //     const milestone = this.milestones[i];
//   //     if (!milestone.name.trim() || !milestone.description.trim()) {
//   //       toast.warning(`Milestone ${i + 1} Title and Description are required.`);
//   //       return false;
//   //     }
  
//   //     for (let j = 0; j < milestone.sections.length; j++) {
//   //       const section = milestone.sections[j];
//   //       if (!section.name.trim() || !section.description.trim()) {
//   //         toast.warning(`Section ${j + 1} in Milestone ${i + 1} Title and Description are required.`);
//   //         return false;
//   //       }
  
//   //       for (let k = 0; k < section.tasks.length; k++) {
//   //         const task = section.tasks[k];
//   //         if (!task.name.trim()) {
//   //           toast.warning(`Task ${k + 1} in Section ${j + 1} of Milestone ${i + 1} Title is required.`);
//   //           return false;
//   //         }
//   //         if (!task.dateStart || !task.dateEnd) {
//   //           toast.warning(`Task ${k + 1} in Section ${j + 1} of Milestone ${i + 1} Start Date and End Date are required.`);
//   //           return false;
//   //         }
//   //         if (new Date(task.dateStart) > new Date(task.dateEnd)) {
//   //           toast.warning(`Task ${k + 1} in Section ${j + 1} of Milestone ${i + 1} End Date cannot be before Start Date.`);
//   //           return false;
//   //         }
//   //       }
//   //     }
//   //   }
  
//   //   return true;
//   // };

//   setActiveStep = (step: number) => {
//     runInAction(() => {
//       this.activeStep = step;
//     });
//   };

//   setRoadmapTitle = (title: string) => {
//     runInAction(() => {
//       this.roadmapTitle = title;
//     });
//   };

//   setRoadmapDescription = (description: string) => {
//     runInAction(() => {
//       this.roadmapDescription = description;
//     });
//   };

//   setMilestones = (milestones: Milestone[]) => {
//     runInAction(() => {
//       this.milestones = milestones.map((milestone) => ({
//         name: milestone.name || "",
//         description: milestone.description || "",
//         sections: milestone.sections.map((section) => ({
//           name: section.name || "",
//           description: section.description || "",
//           tasks: section.tasks.map((task) => ({
//             name: task.name || "",
//             dateStart: task.dateStart || "",
//             dateEnd: task.dateEnd || "",
//           })),
//         })),
//       }));
//     });
//   };
  
//   addMilestone = () => {
//     runInAction(() => {
//       this.milestones.push({
//           name: "",
//           description: "",
//           sections: [],
//       });
//     });
//   };

//   deleteMilestone = (index: number) => {
//     runInAction(() => {
//       this.milestones.splice(index, 1);
//     });
//   };

//   addSection = (milestoneIndex: number) => {
//     runInAction(() => {
//       this.milestones[milestoneIndex].sections.push({
//         name: "",
//         description: "",
//         tasks: [],
//       });
//     });
//   };

//   deleteSection = (milestoneIndex: number, sectionIndex: number) => {
//     runInAction(() => {
//       this.milestones[milestoneIndex].sections.splice(sectionIndex, 1);
//     });
//   };

//   addTask = (milestoneIndex: number, sectionIndex: number) => {
//     runInAction(() => {
//       this.milestones[milestoneIndex].sections[sectionIndex].tasks.push({
//         name: "",
//         dateStart: "",
//         dateEnd: "",
//       });
//     });
//   };

//   deleteTask = (milestoneIndex: number, sectionIndex: number, taskIndex: number) => {
//     runInAction(() => {
//       this.milestones[milestoneIndex].sections[sectionIndex].tasks.splice(taskIndex, 1);
//     });
//   };

//   reset() {
//     this.roadmapTitle = "";
//     this.roadmapDescription = "";
//     this.milestones = [];
//     this.activeStep =0;
//   }
// }

// export const roadmapEditStore = new RoadmapEditStore();