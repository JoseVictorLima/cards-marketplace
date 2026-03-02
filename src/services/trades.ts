import http from './http';
import authentication from './authentication';

const baseUrl = '/trades';

const getTrades = async (
  filter = {
    rpp: 10,
    page: 1,
  },
) => {
  try {
    const resp = await http.get(baseUrl, {
      params: filter,
    });
    return resp.data;
  } catch (error) {
    return error;
  }
};

const deleteTrade = async (tradeId: string) => {
  try {
    const token = authentication.getAccessToken();
    const resp = await http.delete(`${baseUrl}/${tradeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return resp.data;
  } catch (error) {
    return error;
  }
};

export default { getTrades, deleteTrade };
