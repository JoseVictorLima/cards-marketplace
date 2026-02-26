import { defineStore } from 'pinia';
import services from 'src/services';
import type { IUser } from 'src/interfaces';
import { computed, ref, toRaw } from 'vue';

export const userStore = defineStore('user', () => {
  const sessionUser = ref<IUser>({} as IUser);

  const getSessionUser = computed(() => toRaw(sessionUser.value));

  async function setSessionUser() {
    const $services = services;
    const resp = await $services.authentication.getLoggedUser();
    if (resp && resp.id) sessionUser.value = resp;
    else sessionUser.value = {} as IUser;
  }

  return { sessionUser, getSessionUser, setSessionUser };
});
