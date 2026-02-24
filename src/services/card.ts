import http from './http';

const baseUrl = '/cards';

const getCards = async (
  filter = {
    rpp: 10,
    page: 1,
  },
) => {
  try {
    const response = await http.get(baseUrl, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export default { getCards };
