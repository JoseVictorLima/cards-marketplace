import http from './http';
import authentication from './authentication';

const baseUrl = '/me';

const getSessionUser = async () => {
  try {
    const token = authentication.getAccessToken();
    const resp = await http.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return resp.data;
  } catch (error) {
    return error;
  }
};

const getSessionUserCards = async () => {
  try {
    const token = authentication.getAccessToken();
    const resp = await http.get(`${baseUrl}/cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return resp.data;
  } catch (error) {
    return error;
  }
};

const addCards = async (cardIds: string[] = []) => {
  try {
    const token = authentication.getAccessToken();
    const resp = await http.post(
      `${baseUrl}/cards`,
      { cardIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return resp.data;
  } catch (error) {
    return error;
  }
};

export default {
  getSessionUser,
  getSessionUserCards,
  addCards,
};
