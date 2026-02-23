import http from './http';

const baseUrl = '/cards';

const getCards = async (
  filter = {
    rpp: 10,
    page: 1,
  },
) => {
  const response = await http.get(baseUrl, {
    params: filter,
  });
  return response.data;
};

export default { getCards };
