import { makeAutoObservable, runInAction } from "mobx";
import { Roadmap } from "../models/roadmap";
import apiClient from "../api/apiClient";
import {v4 as uuid} from 'uuid'

export default class RoadmapStore {
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

  loadRoadmaps = async (filter?: string, search?: string, date?: string) => {
    this.loadingInitial = true;
    try {
      const params = new URLSearchParams();
      if (filter) params.append("filter", filter);
      if (search) params.append("search", search);
      if (date) params.append("date", date);
  
      const roadmaps = await apiClient.Roadmaps.list(params.toString());
  
      runInAction(() => {
        this.roadmapRegistry.clear();
        roadmaps.forEach((roadmap) => {
          this.setRoadmap(roadmap);
        });
  
        this.calculateDashboardStats();
      });
    } catch (error) {
      console.error(error);
    } finally {
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
        console.log(error);
        // ADD ERROR MSG 
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