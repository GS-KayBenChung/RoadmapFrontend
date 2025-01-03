import axios from "axios";

export interface Task {
  taskId: string;          
  name: string;
  dateStart: string;        
  dateEnd: string;        
}

export interface Section {
  sectionId: string;      
  name: string;
  description: string;
  tasks: Task[];          
}

export interface Milestone {
  milestoneId: string;    
  name: string;
  description: string;      
  sections: Section[];     
}

export interface RoadmapDto {
  title: string;
  description: string;
  milestones: Milestone[];
}

export const EditRoadmap = async (roadmapId: string, roadmapData: RoadmapDto) => {
  try {
    const response = await axios.put(`/roadmaps/${roadmapId}`, roadmapData);
    return response.data;
  } catch (error) {
    console.error("Error editing roadmap:", error);
    throw error;
  }
};