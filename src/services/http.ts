import axios from 'axios';
import qs from 'qs';
import env from 'src/config/env';

const API_URL = env.API_URL;

axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: 'comma' });
};

export default axios.create({
  baseURL: API_URL,
});
