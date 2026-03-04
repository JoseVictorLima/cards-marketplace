import type ICard from './ICard';

interface ITradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: 'OFFERING' | 'RECEIVING';
  card: ICard;
}

interface ITrade {
  id: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
  };
  tradeCards: ITradeCard[];
}

export default ITrade;
