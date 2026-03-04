import type INotify from './INotify';
import type IUser from './IUser';
export default interface IUtils {
  notify: {
    positive: (config: INotify) => void;
    negative: (config: INotify) => void;
  };
  sessionUser: {
    getLoggedUser: () => Promise<IUser>;
  };
}
