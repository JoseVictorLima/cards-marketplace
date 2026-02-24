import { boot } from 'quasar/wrappers';
import { tokenStore } from 'src/stores/token-store';

const $store = {
  token: tokenStore(),
};

export default boot(({ app }) => {
  // Set store injection for use in components
  app.provide('$store', $store);
});
