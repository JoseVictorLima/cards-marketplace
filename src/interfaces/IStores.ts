import type ICard from './ICard';
import type ICart from './ICart';
import type IUser from './IUser';
// import type { SubscriptionCallback } from 'pinia';

export default interface IStores {
  useUser: {
    getSessionUser: IUser;
    setSessionUser: () => Promise<void>;
    resetSessionUser: () => void;
  };
  useCart: {
    getCart: ICart;
    setCart: () => void;
    addOfferingItem: (cards: ICard[]) => void;
    removeOfferingItem: (card: ICard) => void;
    emptyOfferingCart: () => void;
    addReceivingItem: (card: ICard) => void;
    removeReceivingItem: (card: ICard) => void;
    emptyReceivingCart: () => void;
    emptyCart: () => void;
    $subscribe: (
      options: (
        mutation: { type: string; storeId: string; payload: string },
        state: string,
      ) => void,
      extra?: { flush?: string; detached?: boolean; deep?: boolean },
    ) => void;
  };
  useLayout: {
    triggerLogin: () => void;
    $subscribe: (
      options: (
        mutation: { type: string; storeId: string; payload: string },
        state: string,
      ) => void,
      extra?: { flush?: string; detached?: boolean; deep?: boolean },
    ) => void;
  };
}
