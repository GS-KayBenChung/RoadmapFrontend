import { createContext, useContext } from "react";
import UserStore from "./userStore";
import RoadmapStore from "./roadmapStore";

interface Store {
  userStore: UserStore;
  roadmapStore: RoadmapStore;

}

export const store: Store = {
  userStore: new UserStore(),
  roadmapStore: new RoadmapStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}