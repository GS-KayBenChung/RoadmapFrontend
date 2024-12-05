import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';


export default function LoginDashboard() {
  const { userStore } = useStore();
  const navigate = useNavigate(); 

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });

        console.log(res.data);

        // Save token and user data in the store
        userStore.login(response.access_token, res.data);
        navigate("/roadmaps");
      } catch (err) {
        console.log(err);
      }
    },
  });
  // const login = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     try {
  //       const res = await axios.get(
  //         "https://www.googleapis.com/oauth2/v3/userinfo",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${response.access_token}`,
  //           },
  //         }
  //       );
  //       console.log(res);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  // });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-12 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logoGoSaas.png" alt="GoSaas" className="h-24 w-auto"/>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome Back
        </h1>

        <button
          onClick={() => login()}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
