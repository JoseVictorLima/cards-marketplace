import type INotify from './INotify';
export default interface IUtils {
  notify: {
    positive: (config: INotify) => void;
    negative: (config: INotify) => void;
  };
}
