import { makeAutoObservable, runInAction } from "mobx";
import { Roadmap } from "../models/roadmap";
import { AuditLogs } from "../models/auditLogs";
import apiClient from "../api/apiClient";
import {v4 as uuid} from 'uuid'
import { toast } from "react-toastify";

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
    nearDueRoadmaps: 0,
    overdueRoadmaps: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  get roadmaps() {
    return Array.from(this.roadmapRegistry.values());
  }

  updateTaskCompletionStatus = async (
    id: string, 
    type: 'roadmap' | 'milestone' | 'section' | 'task', 
    isChecked: boolean, 
    index?: number, 
    parentIndex?: number, 
    grandParentIndex?: number,
  ) => {
    try {
      const body = {
        id,
        type,
        isChecked,
        index,
        parentIndex,
        grandParentIndex
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
        }
      });
    } catch (error) {
      toast.error("Error updating task completion status");
    }
  };

  loadLogs = async (
    filter?: string,
    search?: string,
    date?: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = "Date",
    asc: number = 1
  ) => {
    this.loadingInitial = true;
    try {
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (search) params.append("search", search);
      if (date) params.append("date", date);
      params.append("pageNumber", pageNumber.toString());
      params.append("pageSize", pageSize.toString());
      params.append("sortBy", sortBy.toLowerCase());
      params.append("asc", asc.toString());
      const result = await apiClient.Roadmaps.getLogs(params.toString());
      runInAction(() => {
        this.logs = result.items; 
        this.currentPage = pageNumber;
        this.totalPages = result.totalPages; 
        pageSize = result.pageSize;
        
        this.loadingInitial = false;
      });
    } catch (error) {
      toast.error("Failed to load logs:");
      this.loadingInitial = false;
    }
  };

  loadRoadmaps = async (
    filter?: string,
    search?: string,
    date?: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = "UpdatedAt",
    asc: number = 1
  ) => {
    this.loadingInitial = true;
    try {
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (search) params.append("search", search);
      if (date) params.append("date", date);
      params.append("pageNumber", pageNumber.toString());
      params.append("pageSize", pageSize.toString());
      params.append("sortBy", sortBy.toLowerCase());
      params.append("asc", asc.toString());
      const result = await apiClient.Roadmaps.list(params.toString());
      runInAction(() => {
        this.roadmapRegistry.clear();
        result.items.forEach((roadmap) => {
          this.setRoadmap(roadmap);
        });
  
        this.currentPage = pageNumber;
        this.totalPages = result.totalPages; 
        pageSize = result.pageSize;
        
        this.loadingInitial = false;
      });
    } catch (error) {
      toast.error("Failed to load roadmaps:");
      this.loadingInitial = false;
    }
  };

  loadDashboardStats = async () => {
    this.loadingInitial = true;
    try {
      const result = await apiClient.Roadmaps.getDashboard();
      runInAction(() => {
        this.dashboardStats = result;  
        this.loadingInitial = false;
      });
    } catch (error) {
      toast.error("Failed to load dashboard stats:");
    }
  };
 
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
      toast.error("Error editing roadmap:");
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
      toast.error("Error deleting roadmap:");
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