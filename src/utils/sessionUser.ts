import type { IService, IUser } from 'src/interfaces';
import services from 'src/services';
import { userStore } from 'src/stores/user-store';

const $services = services as IService;
const $stores = {
  useUser: userStore(),
};

async function getLoggedUser() {
  const token = $services.authentication.getAccessToken();
  if (!!token && !$services.authentication.isTokenExpired(token)) {
    if (!$stores.useUser.getSessionUser.id) {
      try {
        await $stores.useUser.setSessionUser();
        return $stores.useUser.getSessionUser;
      } catch (error) {
        console.log(error);
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
