import axios from "axios";
import API_URL from "../config/apiConfig";

export interface Task {
  name: string;
  dateStart: string;
  dateEnd: string;
  isCompleted: boolean; 
  isDeleted: boolean; 
  created_at: string; 
  updated_at: string; 
}

export interface Section {
  name: string;
  description: string;
  isCompleted: boolean; 
  isDeleted: boolean; 
  created_at: string; 
  updated_at: string; 
  tasks: Task[];
}

export interface Milestone {
  name: string;
  description: string;
  milestone_progress: number; 
  isCompleted: boolean; 
  isDeleted: boolean; 
  created_at: string; 
  updated_at: string; 
  sections: Section[];
}

export interface RoadmapDto {
  title: string;
  description: string;
  createdBy: string;
  overall_progress: number; 
  overall_duration: number; 
  isCompleted: boolean; 
  isDraft: boolean; 
  isDeleted: boolean; 
  milestones: Milestone[];
}

export const createRoadmap = async (roadmapData: RoadmapDto) => {
  try {
    const response = await axios.post(API_URL.roadmap, roadmapData);
    return response.data;
  } catch (error) {
    console.error("Error creating roadmap:", error);
    throw error;
  }
};