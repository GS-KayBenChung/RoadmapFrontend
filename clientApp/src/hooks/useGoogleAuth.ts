
import { toast } from "react-toastify";
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
      //sending crediential

      const data = await apiClient.Roadmaps.googleLogin(token);

      if (!data) {
        throw new Error("Failed to authenticate with Google");
      }

      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        token: data.token,//not token is credientals

        //NOTES : WRONG WAY TO DO IT should serialized it (id, username, email)
        //serializedToken: data.serializedToken,

        createdAt: data.createdAt,
      };

      login(user);

      if (userStore.isLoggedIn) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Error during Google login:");
    }
  };

  return {
    handleGoogleLogin,
  };
};