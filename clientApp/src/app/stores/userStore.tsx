import { makeAutoObservable } from "mobx";

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
}
