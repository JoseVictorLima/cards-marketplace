import { boot } from 'quasar/wrappers';
import services from 'src/services';

export default boot(({ app }) => {
  app.provide('$services', services);
});
