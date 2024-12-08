// import { Navigate } from 'react-router-dom';
// import { useUser } from './userContext';

// const RequireAuth = ({ children }: { children: JSX.Element }) => {
//   const { user } = useUser();

//   // If no user is logged in, redirect to the login page ("/")
//   if (!user) {
//     return <Navigate to="/" />;
//   }

//   return children; // If authenticated, allow access to the protected route
// };

// export default RequireAuth;

// RequireAuth.tsx
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default RequireAuth;
