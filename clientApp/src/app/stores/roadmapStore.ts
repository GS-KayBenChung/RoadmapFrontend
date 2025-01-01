import { makeAutoObservable, runInAction } from "mobx";
import { Roadmap } from "../models/roadmap";
import { AuditLogs } from "../models/auditLogs";
import apiClient from "../api/apiClient";
import {v4 as uuid} from 'uuid'

export default class RoadmapStore {
  logs: AuditLogs[] = [];
  currentPage = 1;
  totalPages = 1;
  roadmapRegistry = new Map<string, Roadmap>();
  selectedRoadmap: Roadmap | undefined = undefined;
  editMode = false;
  submitting = false;
  loadingInitial = false;
  dashboardStats = {
    totalRoadmaps: 0,
    draftRoadmaps: 0,
    completedRoadmaps: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  get roadmaps() {
    return Array.from(this.roadmapRegistry.values());
  }

  updateTaskCompletionStatus = async (id: string, type: 'roadmap' | 'milestone' | 'section' | 'task', isChecked: boolean, index?: number, parentIndex?: number) => {
    try {
      const body = {
        id,
        type,
        isChecked,
        index,
        parentIndex,
      };
      await apiClient.Roadmaps.updateCheck(body);
      runInAction(() => {
        if (type === 'roadmap') {
          this.selectedRoadmap!.isCompleted = isChecked;
        } else if (type === 'milestone' && index !== undefined) {
          const milestone = this.selectedRoadmap!.milestones[index];
          milestone.isCompleted = isChecked;
        } else if (type === 'section' && index !== undefined && parentIndex !== undefined) {
          const section = this.selectedRoadmap!.milestones[parentIndex].sections[index];
          section.isCompleted = isChecked;
        } else if (type === 'task' && index !== undefined && parentIndex !== undefined) {
          const task = this.selectedRoadmap!.milestones[parentIndex].sections[index].tasks[index];
          task.isCompleted = isChecked;
          console.log("Roadmapstore: task updated" + task.isCompleted);
        }
      });
    } catch (error) {
      console.error("Error updating task completion status", error);
    }
  };
  
  loadLogs = async (filter?: string, search?: string, pageNumber: number = 1) => {
    try {
      const params = new URLSearchParams();
  
      if (filter) params.append("filter", filter);
      if (search) params.append("search", search);
      params.append("pageNumber", pageNumber.toString());
  
      const result = await apiClient.Roadmaps.getLogs(params.toString());

      runInAction(() => {
        this.logs = result.items; 
        this.totalPages = result.totalPages; 
      });
    } catch (error) {
      console.error("Failed to fetch logs", error);
    }
  };

  loadRoadmaps = async (
    filter?: string,
    search?: string,
    date?: string,
    pageNumber: number = 1
  ) => {
    this.loadingInitial = true;
    try {
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (search) params.append("search", search);
      if (date) params.append("date", date);
      params.append("pageNumber", pageNumber.toString());
  
      const result = await apiClient.Roadmaps.list(params.toString());
  
      runInAction(() => {
        this.roadmapRegistry.clear();
        result.items.forEach((roadmap) => {
          this.setRoadmap(roadmap);
        });
  
        this.currentPage = pageNumber;
        this.totalPages = result.totalPages; 
        this.calculateDashboardStats();
        this.loadingInitial = false;
      });
    } catch (error) {
      console.error(error);
      this.loadingInitial = false;
    }
  };
  
  calculateDashboardStats() {
    const totalRoadmaps = this.roadmaps.length;
    const draftRoadmaps = this.roadmaps.filter(r => r.isDraft).length;
    const completedRoadmaps = this.roadmaps.filter(r => r.isCompleted).length;
  
    this.dashboardStats = {
      totalRoadmaps,
      draftRoadmaps,
      completedRoadmaps,
    };
  }
  
  EditRoadmap = async (roadmap: Roadmap) => {
    this.submitting = true;
    try {
      if (roadmap.roadmapId) {
        await apiClient.Roadmaps.update(roadmap);
        this.roadmapRegistry.set(roadmap.roadmapId, roadmap);
      } else {
        roadmap.roadmapId = uuid();
        await apiClient.Roadmaps.create(roadmap);
        this.roadmapRegistry.set(roadmap.roadmapId, roadmap);
      }
      //this.selectedRoadmap = roadmap;
      this.editMode = false;
    } catch (error) {
      console.error("Error creating or editing roadmap:", error);
    } finally {
      this.submitting = false;
    }
  };

  deleteRoadmap = async (id: string, navigate: (path: string) => void) => {
    this.submitting = true;
    try {
      await apiClient.Roadmaps.delete(id);
      this.roadmapRegistry.delete(id);
      navigate('/content');
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      this.submitting = false;
    } 
  }

  loadRoadmap = async (id: string) => {
    this.loadingInitial = true;
    let roadmap = this.getRoadmap(id);
    try {
      roadmap = await apiClient.Roadmaps.details(id);
      this.setRoadmap(roadmap);
      runInAction(() => {
        this.selectedRoadmap = roadmap;
        this.loadingInitial = false;
      });
      return roadmap;
      
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  }
  
  private getRoadmap = (id: string) => {
    return this.roadmapRegistry.get(id)
  }
  private setRoadmap = (roadmap: Roadmap) => {
    this.roadmapRegistry.set(roadmap.roadmapId, roadmap);
  }
}