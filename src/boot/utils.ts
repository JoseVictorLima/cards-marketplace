import { boot } from 'quasar/wrappers';
import utils from 'src/utils';

export default boot(({ app }) => {
  // Set utils injection for use in components
  app.provide('$utils', utils);
});
