import { makeAutoObservable } from "mobx";

export default class UserStore {
  isLoggedIn = false; // Indicates login status
  token: string | null = null; // Holds the token
  user: any = null; // Holds user data (optional)

  constructor() {
    makeAutoObservable(this);

    // On initialization, check local storage for a saved token
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
    localStorage.setItem("token", token); // Persist the token
  }

  logout() {
    this.token = null;
    this.user = null;
    this.isLoggedIn = false;
    localStorage.removeItem("token"); // Clear saved token
  }
}
