// import { useEffect, useState } from "react";
// import { useStore } from "../stores/store";

// export const auth = () => {
//     const { userStore } = useStore();
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         userStore.loadUserFromLocalStorage();
//         setIsAuthenticated(!!userStore.user);
//     }, [userStore]);

//     const login = (user: any) => {
//         userStore.setUser(user);
//         setIsAuthenticated(true);
//     };

//     const logout = () => {
//         userStore.logout();
//         setIsAuthenticated(false);
//     };

//     return {
//         isAuthenticated,
//         user: userStore.user,
//         login,
//         logout,
//     };
// };