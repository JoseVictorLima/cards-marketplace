import type ICard from './ICard';
import type IUser from './IUser';
import type ITrade from './ITrade';

interface IGetCardsResult {
  list: ICard[];
  more: boolean;
  page: number;
  rpp: number;
}

interface ILoginResult {
  token: string;
  user: Omit<IUser, 'cards'>;
}

interface IGetTradesresult {
  list: ITrade[];
  more: boolean;
  page: number;
  rpp: number;
}

export default interface IService {
  authentication: {
    login: (credentials: { email: string; password: string }) => Promise<ILoginResult>;
    logout: () => void;
    register: (newUser: {
      name: string;
      email: string;
      password: string;
    }) => Promise<{ userId: string }>;
    setAccessToken: (token: string) => void;
    getAccessToken: () => string;
    removeAccessToken: () => void;
    isTokenExpired: (token: string) => boolean;
  };
  card: {
    getCards: (filter: { rpp: number; page: number }) => Promise<IGetCardsResult>;
  };
  me: {
    getSessionUser: () => Promise<IUser>;
    getSessionUserCards: () => Promise<ICard[]>;
    addCards: (cardIds: string[]) => Promise<void>;
  };
  trades: {
    getTrades: (filter: { rpp: number; page: number }) => Promise<IGetTradesresult>;
    saveTrade: (offering: ICard[], receiving: ICard[]) => Promise<{ tradeId: string }>;
    deleteTrade: (tradeId: string) => Promise<void>;
  };
}
