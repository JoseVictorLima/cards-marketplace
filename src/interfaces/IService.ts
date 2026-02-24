import type ICard from './ICard';
import type IUser from './IUser';

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

export default interface IService {
  authentication: {
    login: (credentials: { email: string; password: string }) => Promise<ILoginResult>;
    setToken: (token: string) => void;
    isTokenExpired: (token: string) => boolean;
  };
  card: {
    getCards: (filter: { rpp: number; page: number }) => Promise<IGetCardsResult>;
  };
}
