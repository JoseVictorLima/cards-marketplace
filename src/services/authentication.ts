import http from './http';
import { jwtDecode } from 'jwt-decode';
import { tokenStore } from 'src/stores/token-store';

const baseUrl = '/login';
const $store = {
  token: tokenStore(),
};

const login = async (credentials = { email: '', password: '' }) => {
  try {
    const resp = await http.post(baseUrl, credentials);
    return resp.data;
  } catch (error) {
    return error;
  }
};

const isTokenExpired = (token: string) => {
  try {
    if (!token) return false;
    const jwd = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    if (jwd != undefined) return jwd.exp < currentTime;
    return true;
  } catch (error) {
    console.log(error);
    return true;
  }
};

const setToken = (token: string) => {
  $store.token.setToken(token);
  console.log($store.token.getToken);
};

export default {
  login,
  setToken,
  isTokenExpired,
};
