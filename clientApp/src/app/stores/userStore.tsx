// import { makeAutoObservable } from "mobx";
// import { User } from "../models/user";

import { makeAutoObservable } from "mobx";
import { User } from "../models/user";

// export default class UserStore {
//   user: User | null = null;  
//   token: string | null = localStorage.getItem('appToken') || null;

//   constructor() {
//     makeAutoObservable(this);
//     this.loadUserFromLocalStorage();
//   }

//   get isLoggedIn() {
//     return !!this.user;
//   }

//   setUser = (user: User) => {
//     this.user = user;
//     this.token = user.token;
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("appToken", user.token); 
//   };

//   logout = () => {
//     this.user = null;
//     this.token = null;
//     localStorage.removeItem("user");
//     localStorage.removeItem("appToken");
//     localStorage.removeItem("view");
//   };
  
//   loadUserFromLocalStorage = () => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       this.user = JSON.parse(storedUser);
//       this.token = localStorage.getItem('appToken');
//     }
//   };
// }

export default class UserStore {
  user: User | null = null;
  token: string | null = localStorage.getItem('appToken') || null;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromLocalStorage();
  }

  get isLoggedIn() {
    return !!this.user;
  }

  get userId() {
    return this.user?.id ?? null; // <-- This makes it easier to get user ID
  }

  setUser = (user: User) => {
    this.user = user;
    this.token = user.token;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("appToken", user.token);
  };

  logout = () => {
    this.user = null;
    this.token = null;
    localStorage.removeItem("user");
    localStorage.removeItem("appToken");
  };

  loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.token = localStorage.getItem('appToken');
    }
  };
}
