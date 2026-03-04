import http from './http';

const baseUrl = '/cards';

const getCards = async (
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

export default { getCards };
