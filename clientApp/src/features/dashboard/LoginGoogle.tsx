import { GoogleLogin } from "@react-oauth/google";
import { observer } from "mobx-react-lite";
import { useGoogleAuth } from "../../hooks/useGoogleAuth"; 
import { useStore } from "../../app/stores/store";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { toast } from "react-toastify";

export default observer(function Login() {
  const { handleGoogleLogin } = useGoogleAuth();
  const {roadmapStore} = useStore();
  const {loadingInitial} = roadmapStore;

  const handleSuccess = (credentialResponse: any) => {
    handleGoogleLogin(credentialResponse);        
  };

  const handleError = () => {
    toast.error("Google Login Failed");
  };

  if (loadingInitial) return <LoadingComponent/>
  
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-12 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src="/logoGoSaas.png" alt="GoSaas" className="h-24 w-auto" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back</h1>
          <div className="flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
            />
          </div>
        </div>
      </div>
    </>
  );
});