import axios from 'axios';

export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return;
    }

    const res = await axios.get<{ name: string; email: string }>(
      'https://your-backend-api.com/api/user', 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};