// import { makeAutoObservable } from "mobx"
// import { Roadmap } from "../models/roadmap"
// import apiClient from "../api/apiClient";

// export default class RoadmapStore {

//     roadmaps: Roadmap[] = [];
//     selectedRoadmap: Roadmap | null = null;
//     editmode = false
//     loading = false
//     loadingInitial = false

//     constructor(){
//         makeAutoObservable(this)
//     }

//     loadRoadmap = async () => {
//         this.loadingInitial = true;
//         try {
//             this.loadingInitial = false;
//         } catch (error) {
//             console.log(error);
//             this.loadingInitial = false;
//         }
//     }

// }

import { makeAutoObservable } from "mobx";
import { Roadmap } from "../models/roadmap";
import apiClient from "../api/apiClient";

export default class RoadmapStore {
  roadmaps: Roadmap[] = [];
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadRoadmaps = async () => {
    this.loadingInitial = true;
    try {
      const roadmaps = await apiClient.Roadmaps.list();
      this.roadmaps = roadmaps;
    } catch (error) {
      console.error("Error loading roadmaps:", error);
    } finally {
      this.loadingInitial = false;
    }
  };
}
