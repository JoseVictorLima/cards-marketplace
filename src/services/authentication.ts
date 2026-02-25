import http from './http';
import { jwtDecode } from 'jwt-decode';

const baseUrl = '/login';

const login = async (credentials = { email: '', password: '' }) => {
  try {
    const resp = await http.post(baseUrl, credentials);
    return resp.data;
  } catch (error) {
    return error;
  }
};

const logout = () => {
  removeAccessToken();
};

const isTokenExpired = (token: string) => {
  try {
    if (!token) return true;
    const jwd = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    if (jwd != undefined) return jwd.exp < currentTime;
    return true;
  } catch (error) {
    console.log(error);
    return true;
  }
};

const setAccessToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

const removeAccessToken = () => {
  localStorage.removeItem('access_token');
};

const getLoggedUser = async () => {
  try {
    const token = getAccessToken();
    const resp = await http.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return resp.data;
  } catch (error) {
    return error;
  }
};

export default {
  login,
  logout,
  isTokenExpired,
  setAccessToken,
  getAccessToken,
  removeAccessToken,
  getLoggedUser,
};
