import { createContext, useContext } from "react";
import UserStore from "./userStore";
import RoadmapStore from "./roadmapStore";
// import UserStoreTest from "./userStoreTest";

interface Store {
  userStore: UserStore;
  roadmapStore: RoadmapStore;
  // userStoreTest: UserStoreTest;
}

export const store: Store = {
  userStore: new UserStore(),
  roadmapStore: new RoadmapStore(),
  // userStoreTest: new UserStoreTest()
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}