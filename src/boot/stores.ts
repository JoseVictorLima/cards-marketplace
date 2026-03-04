import { boot } from 'quasar/wrappers';
import { cartStore } from 'src/stores/cart-store';
import { layoutStore } from 'src/stores/layout-store';
import { userStore } from 'src/stores/user-store';

const $stores = {
  useUser: userStore(),
  useCart: cartStore(),
  useLayout: layoutStore(),
};

export default boot(({ app }) => {
  // Set stores injection for use in components
  app.provide('$stores', $stores);
});
