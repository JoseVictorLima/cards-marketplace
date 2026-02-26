import type ICard from './ICard';

export default interface IUser {
  id: string;
  name: string;
  email: string;
  cards?: ICard[];
}
