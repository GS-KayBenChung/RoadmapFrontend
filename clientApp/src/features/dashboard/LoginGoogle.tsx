import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../userContext';

const LoginGoogle = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential,
      });

      const userData = response.data; 

      setUser({
        email: userData.email,
        name: userData.name,
        token: userData.token,
      });

      localStorage.setItem('user', JSON.stringify(userData)); 
      localStorage.setItem('token', userData.token);  

      navigate('/dashboard');
    } catch (error) {
    }
  };

  const handleLoginFailure = () => {
    console.error('Google login failed.');
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginFailure} />
    </div>
  );
};

export default LoginGoogle;