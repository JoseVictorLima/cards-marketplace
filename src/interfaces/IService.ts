import type ICard from './ICard';

interface IGetCardsResult {
  list: ICard[];
  more: boolean;
  page: number;
  rpp: number;
}

export default interface IService {
  card: {
    getCards: (filter: { rpp: number; page: number }) => Promise<IGetCardsResult>;
  };
}
