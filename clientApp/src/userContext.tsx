import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Optionally check localStorage or sessionStorage for a token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Assuming token validation process, if valid set the user
      setUser({ email: 'user@example.com', name: 'User', token: storedToken });
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
