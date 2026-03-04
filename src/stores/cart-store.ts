import { defineStore } from 'pinia';
import { computed, ref, toRaw } from 'vue';
import type { ICard, ICart } from 'src/interfaces';

export const cartStore = defineStore('cart', () => {
  const cart = ref({
    offering: [] as ICard[],
    receiving: [] as ICard[],
  } as ICart);

  const getCart = computed(() => toRaw(cart.value));

  function setCart() {
    const storageItem = localStorage.getItem('cart');
    if (storageItem) {
      const storedCart = JSON.parse(storageItem);
      cart.value = storedCart.cart as ICart;
    } else {
      cart.value = {
        offering: [],
        receiving: [],
      };
    }
  }

  function addOfferingItem(cards: ICard[]) {
    cart.value.offering = [...cards, ...cart.value.offering];
    localStorage.setItem('cart', JSON.stringify(cart.value));
  }

  function removeOfferingItem(card: ICard) {
    if (card && card.id) {
      const index = cart.value.offering.findIndex((item) => item.id === card.id);
      if (index != -1) {
        cart.value.offering.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart.value));
      }
    }
  }

  function emptyOfferingCart() {
    cart.value.offering = [] as ICard[];
  }

  function addReceivingItem(card: ICard) {
    cart.value.receiving.push(card);
    localStorage.setItem('cart', JSON.stringify(cart.value));
  }

  function removeReceivingItem(card: ICard) {
    if (card && card.id) {
      const index = cart.value.receiving.findIndex((item) => item.id === card.id);
      if (index != -1) {
        cart.value.receiving.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart.value));
      }
    }
  }

  function emptyReceivingCart() {
    cart.value.receiving = [] as ICard[];
  }

  function emptyCart() {
    cart.value = {
      offering: [],
      receiving: [],
    } as ICart;
  }

  return {
    cart,
    getCart,
    setCart,
    addOfferingItem,
    removeOfferingItem,
    emptyOfferingCart,
    addReceivingItem,
    removeReceivingItem,
    emptyReceivingCart,
    emptyCart,
  };
});
