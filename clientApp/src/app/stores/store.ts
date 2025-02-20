import { createContext, useContext } from "react";
import UserStore from "./userStore";
import RoadmapStore from "./roadmapStore";
// import RoadmapEditTestStore from "./roadmapEditTestStore";

interface Store {
  userStore: UserStore;
  roadmapStore: RoadmapStore;
  // roadmapEditTestStore: RoadmapEditTestStore;
}

export const store: Store = {
  userStore: new UserStore(),
  roadmapStore: new RoadmapStore(new UserStore()),
  // roadmapEditTestStore: new RoadmapEditTestStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}