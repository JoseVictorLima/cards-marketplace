import { boot } from 'quasar/wrappers';
import { userStore } from 'src/stores/user-store';

const $stores = {
  useUser: userStore(),
};

export default boot(({ app }) => {
  // Set stores injection for use in components
  app.provide('$stores', $stores);
});
