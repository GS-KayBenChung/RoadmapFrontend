import { makeAutoObservable } from "mobx";
// import { User } from "../models/user";

export default class UserStore {
  isLoggedIn = false;
  token: string | null = null;
  user: any = null;

  constructor() {
    makeAutoObservable(this);
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      this.token = savedToken;
      this.isLoggedIn = true;
    }
  }

  login(token: string, user: any) {
    this.token = token;
    this.user = user;
    this.isLoggedIn = true;
    localStorage.setItem("token", token);
  }

  logout() {
    this.token = null;
    this.user = null;
    this.isLoggedIn = false;
    localStorage.removeItem("token");
  }

  // async loginWithGoogle(decodedToken: any) {
  //   try {
  //     await apiClient.Roadmaps.googleGet(decodedToken);
  //     console.log("Google authentication successful");
  //   } catch (error) {
  //     console.error("Google authentication failed:", error);
  //     throw new Error("Failed to authenticate with Google");
  //   }
  // }
}

//   user: User | null = null;  
//   token: string | null = localStorage.getItem('appToken') || null;

//   constructor() {
//     makeAutoObservable(this);
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