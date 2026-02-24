import { defineStore } from 'pinia';

export const tokenStore = defineStore('token', {
  state: () => ({
    token: '',
  }),

  getters: {
    getToken: (state) => state.token,
  },

  actions: {
    setToken(accessToken: string) {
      if (accessToken) this.token = accessToken;
    },

    resetToken() {
      this.token = '';
    },
  },
});
