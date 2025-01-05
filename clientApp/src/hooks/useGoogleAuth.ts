
import apiClient from "../app/api/apiClient";
import { useStore } from "../app/stores/store";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { userStore } = useStore();

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;

      const data = await apiClient.Roadmaps.googleLogin(token);

      if (!data) {
        throw new Error("Failed to authenticate with Google");
      }

      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        token: data.token,
        createdAt: data.createdAt,
      };

      login(user);

      if (userStore.isLoggedIn) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return {
    handleGoogleLogin,
  };
};