import { boot } from 'quasar/wrappers';
import ytmComponents from 'src/components/ytm';

export default boot(({ app }) => {
  //Global basic components configuration

  Object.keys(ytmComponents).forEach((key) => {
    app.component(`ytm-${key}`, ytmComponents[key as keyof typeof ytmComponents]);
  });
});
