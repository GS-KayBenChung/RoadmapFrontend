// import { GoogleLogin } from '@react-oauth/google';
// import { observer } from "mobx-react-lite";
// import { googleLoginAuth } from '../../app/googleAuth/googleLogin';

// export default observer(function LoginGoogle() {
//   const { handleGoogleLogin } = googleLoginAuth();

//   const handleSuccess = (credentialResponse: any) => {
//     handleGoogleLogin(credentialResponse);        
//   };

//   return (
//     <div className="login-container">
//       <h1>Login</h1>
//       <GoogleLogin
//         onSuccess={handleSuccess}
//         onError={() => console.log("Login Failed")}
//       />
//     </div>
//   );
// });