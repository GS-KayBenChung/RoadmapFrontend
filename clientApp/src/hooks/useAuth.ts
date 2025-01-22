import { useEffect, useState } from "react";
import { useStore } from "../app/stores/store";

export const useAuth = () => {
    const { userStore } = useStore();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        userStore.loadUserFromLocalStorage();
        setIsAuthenticated(!!userStore.user);
        setLoading(false);
    }, [userStore]);

    const login = (user: any) => {
        userStore.setUser(user);
        setIsAuthenticated(true);
        //call
    };

    const logout = () => {
        userStore.logout();
        setIsAuthenticated(false);
        //call
    };

    return {
        isAuthenticated,
        user: userStore.user,
        login,
        logout,
        loading, 
    };
};