import http from './http';
import { jwtDecode } from 'jwt-decode';

const loginBaseUrl = '/login';
const registerBaseUrl = '/register';

const login = async (credentials = { email: '', password: '' }) => {
  try {
    const resp = await http.post(loginBaseUrl, credentials);
    return resp.data;
  } catch (error) {
    if (typeof error === 'object' && error != null) {
      if ('response' in error && error != null) {
        if (typeof error.response === 'object' && error.response != null) {
          if ('data' in error.response) return error.response.data;
        }
      }
    }
    return error;
  }
};

const logout = () => {
  removeAccessToken();
};

const register = async (newUser: { name: string; email: string; password: string }) => {
  try {
    const resp = await http.post(registerBaseUrl, newUser);
    return resp.data;
  } catch (error) {
    return error;
  }
};

const isTokenExpired = (token: string) => {
  try {
    if (!token) return true;
    const jwd = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now();
    if (jwd != undefined) return jwd.exp * 1000 < currentTime;
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

export default {
  login,
  logout,
  register,
  isTokenExpired,
  setAccessToken,
  getAccessToken,
  removeAccessToken,
};
