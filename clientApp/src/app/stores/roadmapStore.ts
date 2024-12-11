import { makeAutoObservable } from "mobx";
import { Roadmap } from "../models/roadmap";
import apiClient from "../api/apiClient";
import {v4 as uuid} from 'uuid'

export default class RoadmapStore {
  roadmapRegistry = new Map<string, Roadmap>();
  selectedRoadmap: Roadmap | undefined = undefined;
  editMode = false;
  submitting = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get roadmaps() {
    return Array.from(this.roadmapRegistry.values());
  }

  loadRoadmaps = async () => {
    this.loadingInitial = true;
    try {
      const roadmaps = await apiClient.Roadmaps.list();
      roadmaps.forEach((roadmap) => {
        this.setRoadmap(roadmap);
      });
    } catch (error) {
      console.error("Error loading roadmaps:", error);
    } finally {
      this.loadingInitial = false;
    }
  };

  //FOR TESTING --------------------------------------------
  // selectRoadmap = (id: string) => {
  //   this.selectedRoadmap = this.roadmapRegistry.get(id);
  // };

  // cancelSelectRoadmap = () => {
  //   this.selectedRoadmap = undefined;
  // };

  // openForm = (id?: string) => {
  //   if (id) {
  //     this.selectRoadmap(id);
  //   } else {
  //     this.cancelSelectRoadmap();
  //   }
  //   this.editMode = true;
  // };

  // closeForm = () => {
  //   this.editMode = false;
  // };

  createOrEditRoadmap = async (roadmap: Roadmap) => {
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
      this.selectedRoadmap = roadmap;
      this.editMode = false;
    } catch (error) {
      console.error("Error creating or editing roadmap:", error);
    } finally {
      this.submitting = false;
    }
  };

  deleteRoadmap = async (id: string) => {
    this.submitting = true;
    try {
      await apiClient.Roadmaps.delete(id);
      this.roadmapRegistry.delete(id);
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      this.submitting = false;
    } 
  };

  loadRoadmap = async (id: string) => {
    let roadmap = this.getRoadmap(id);
    if (roadmap) this.selectedRoadmap = roadmap;
    else {
      this.loadingInitial = true;
      try {
        roadmap = await apiClient.Roadmaps.details(id);
        this.setRoadmap(roadmap);
        this.selectedRoadmap = roadmap;
        this.loadingInitial = false;
      } catch (error) {
        console.log(error);
        this.loadingInitial = false;
      }
    }
  }

  private getRoadmap = (id: string) => {
    return this.roadmapRegistry.get(id)
  }
  private setRoadmap = (roadmap: Roadmap) => {
    this.roadmapRegistry.set(roadmap.roadmapId, roadmap);
  }
}
