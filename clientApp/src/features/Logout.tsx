import { useNavigate } from 'react-router-dom';
import { useStore } from '../app/stores/store';

const LogoutButton = () => {
  const { userStore } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    userStore.logout();
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