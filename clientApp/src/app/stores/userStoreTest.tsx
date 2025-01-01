import { makeAutoObservable } from "mobx";

class UserStoreTest {
  constructor() {
    makeAutoObservable(this);
  }

  async loginWithGoogle(decodedToken: any) {
    // Send token to backend for validation
    const response = await fetch("/api/auth/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: decodedToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate");
    }
    // Handle successful login (e.g., set user data)
  }
}

export const userStoreTest = new UserStoreTest();
