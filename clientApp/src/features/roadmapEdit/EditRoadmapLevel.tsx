import { roadmapEditStore } from "../../app/stores/roadmapEditStore";



export default function EditRoadmapLevel(){
  const { roadmapTitle, roadmapDescription, milestones } = roadmapEditStore;

  const roadmap = {
    name: roadmapTitle,
    description: roadmapDescription,
    children: milestones.map((milestone) => ({
      name: milestone.title,
      attributes: {
        description: milestone.description,
      },
      children: milestone.sections.map((section) => ({
        name: section.title,
        attributes: {
          description: section.description,
        },
        children: section.tasks.map((task) => ({
          name: task.title,
          attributes: {
            startDate: task.startDate,
            endDate: task.endDate,
          },
        })),
      })),
    })),
  };

  console.log(JSON.stringify(roadmap, null, 2));
};