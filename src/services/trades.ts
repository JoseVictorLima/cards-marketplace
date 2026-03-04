import http from './http';
import authentication from './authentication';
import type { ICard } from 'src/interfaces';

const baseUrl = '/trades';

interface tradeCard {
  cardId: string;
  type: 'OFFERING' | 'RECEIVING';
}

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

const saveTrade = async (offering: ICard[], receiving: ICard[]) => {
  try {
    const cards = [] as tradeCard[];
    if (offering.length > 0) {
      for (const o of offering) {
        cards.push({
          cardId: o.id,
          type: 'OFFERING',
        });
      }
    }
    if (receiving.length > 0) {
      for (const r of receiving) {
        cards.push({
          cardId: r.id,
          type: 'RECEIVING',
        });
      }
    }
    const token = authentication.getAccessToken();
    const resp = await http.post(
      baseUrl,
      { cards },
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

export default { getTrades, saveTrade, deleteTrade };
