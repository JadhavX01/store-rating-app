import axios from 'axios';

const API_URL = 'http://localhost:5000/api/owner';

const getDashboard = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export default { getDashboard };
