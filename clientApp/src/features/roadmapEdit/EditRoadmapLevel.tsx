import { roadmapEditStore } from "../../app/stores/roadmapEditStore";

export default function EditRoadmapLevel(){
  const { roadmapTitle, roadmapDescription, milestones } = roadmapEditStore;

  const roadmap = {
    name: roadmapTitle,
    description: roadmapDescription,
    children: milestones.map((milestone) => ({
      name: milestone.name,
      attributes: {
        description: milestone.description,
      },
      children: milestone.sections.map((section) => ({
        name: section.name,
        attributes: {
          description: section.description,
        },
        children: section.tasks.map((task) => ({
          name: task.name,
          attributes: {
            startDate: task.dateStart,
            endDate: task.dateEnd,
          },
        })),
      })),
    })),
  };

  console.log(JSON.stringify(roadmap, null, 2));
};