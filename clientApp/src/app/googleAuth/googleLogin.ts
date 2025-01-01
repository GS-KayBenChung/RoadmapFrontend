
// import { useNavigate } from "react-router-dom";
// import { auth } from "./auth";

// export const googleLoginAuth = () => {
//     const { login } = auth();
//     const navigate = useNavigate();

//     const handleGoogleLogin = async (credentialResponse: any) => {
//         try {
//             const token = credentialResponse.credential;

//             const response = await fetch("http://localhost:5000/api/auth/googleresponse", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ credential: token }),
//             });
            
//             if (!response.ok) {
//                 throw new Error("Failed to authenticate with Google");
//             }

//             const data = await response.json();
//             const user = {
//                 id: data.id,
//                 username: data.username,
//                 email: data.email,
//                 token: data.token,
//                 createdAt: data.createdAt,
//                 updatedAt: data.updatedAt,
//                 image: data.image,
//             };
//             console.log("Real Credential Token:", data.token);

//             login(user);

//             navigate("/content");
//         } catch (error) {
//             console.error("Error during Google login:", error);
//         }
//     };

//     return {
//         handleGoogleLogin,
//     };
// };