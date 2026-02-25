import type IUser from './IUser';

export default interface IStores {
  useUser: {
    getSessionUser: IUser;
    setSessionUser: () => Promise<void>;
  };
}
