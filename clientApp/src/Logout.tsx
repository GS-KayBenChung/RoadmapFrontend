import { useNavigate } from 'react-router-dom';
import { useUser } from './userContext';

const LogoutButton = () => {

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
    >
      Logout
    </button>
  );
};

export default LogoutButton;