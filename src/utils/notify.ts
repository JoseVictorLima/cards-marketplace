import { Notify } from 'quasar';
import type { INotify } from 'src/interfaces';
import { i18n } from 'src/boot/i18n';

const t = i18n.global.t;

const positive = (config: INotify) => {
  return Notify.create({
    type: 'positive',
    message: config.message ? config.message : t('utils.notify.positive'),
    caption: config.caption ? config.caption : '',
    timeout: config.timeout ? config.timeout : 3000,
    position: config.position ? config.position : 'top',
  });
};

const negative = (config: INotify) => {
  return Notify.create({
    type: 'negative',
    message: config.message ? config.message : t('utils.notify.negative'),
    caption: config.caption ? config.caption : '',
    timeout: config.timeout ? config.timeout : 3000,
    position: config.position ? config.position : 'top',
  });
};

export default {
  positive,
  negative,
};
