import { boot } from 'quasar/wrappers';
import services from 'src/services';

export default boot(({ app }) => {
  // Set services injection for use in components
  app.provide('$services', services);
});
