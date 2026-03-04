import type { IService, IUser } from 'src/interfaces';
import services from 'src/services';
import { userStore } from 'src/stores/user-store';
import { useI18n } from 'vue-i18n';
import notify from './notify';

const $services = services as IService;
const $stores = {
  useUser: userStore(),
};

const $utils = {
  notify: notify,
};

async function getLoggedUser() {
  const { t } = useI18n();
  const token = $services.authentication.getAccessToken();
  if (!!token && !$services.authentication.isTokenExpired(token)) {
    if (!$stores.useUser.getSessionUser.id) {
      try {
        await $stores.useUser.setSessionUser();
        if (!$stores.useUser.getSessionUser.id) throw new Error('Unable to get user');
        return $stores.useUser.getSessionUser;
      } catch (error) {
        console.log(error);
        $utils.notify.negative({
          message: t('errors.get_user_data'),
          position: 'bottom',
        });
        return {} as IUser;
      }
    } else {
      return $stores.useUser.getSessionUser;
    }
  }
}

export default {
  getLoggedUser,
};
