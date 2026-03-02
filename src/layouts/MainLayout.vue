<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import loginCard from 'src/pages/login/LoginCard.vue';
import registerCard from 'src/pages/login/RegisterCard.vue';
import services from 'src/services';
import type { IStores, IUser, IUtils } from 'src/interfaces';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t } = useI18n();
const $services = services;
const $stores = inject('$stores') as IStores;
const $utils = inject('$utils') as IUtils;
const $router = useRouter();
const isLoginCardOpen = ref(false);
const isRegisterCardOpen = ref(false);
const sessionUser = ref<IUser>({} as IUser);
const isLoading = ref(true);
const isUserMenuOpen = ref(false);
const timerId = ref<NodeJS.Timeout>();
const sessionUserMenuOptions = [
  {
    label: t('layouts.main_layout.profile'),
    action: async () => {
      await $router.push(`/profile/${sessionUser.value.name}`);
    },
  },
  {
    label: t('layouts.main_layout.logout'),
    action: async () => {
      await logout();
    },
  },
];

// Allows the user menu to remain active when the cursor moves from the menu to the items and vice versa.
const keepUserMenuOpen = () => {
  if (timerId.value) {
    clearTimeout(timerId.value);
  }
  if (!isUserMenuOpen.value) isUserMenuOpen.value = true;
};

// Closes the user menu after a specified period of time.
const closeUserMenuDebounced = () => {
  timerId.value = setTimeout(() => {
    isUserMenuOpen.value = false;
  }, 50);
};

async function logout() {
  $services.authentication.logout();
  $stores.useUser.resetSessionUser();
  sessionUser.value = {} as IUser;
  await $router.push('/');
}

function openLoginCard() {
  if (isRegisterCardOpen.value === true) {
    isRegisterCardOpen.value = false;
  }
  isLoginCardOpen.value = true;
}

function openRegisterCard() {
  isRegisterCardOpen.value = true;
  isLoginCardOpen.value = false;
}

// Checks if the access token is still valid and then loads the logged user.
async function getLoggedUser() {
  const token = $services.authentication.getAccessToken();
  if (!!token && !$services.authentication.isTokenExpired(token)) {
    $q.loading.show();
    if (!$stores.useUser.getSessionUser.id) {
      try {
        await $stores.useUser.setSessionUser();
        sessionUser.value = $stores.useUser.getSessionUser;
      } catch (error) {
        console.log(error);
        $utils.notify.negative({
          message: t('errors.get_user_data'),
          position: 'bottom',
          timeout: 3000,
        });
      }
    } else {
      sessionUser.value = $stores.useUser.getSessionUser;
    }
    $q.loading.hide();
  }
}

onMounted(async () => {
  isLoading.value = true;
  await getLoggedUser();
  isLoading.value = false;
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-secondary text-white q-px-md">
        <q-toolbar-title class="text-primary text-bold">
          <span class="cursor-pointer" @click="$router.push('/')">
            YTM
            <q-tooltip>
              <template v-slot:default>
                <span class="ytm-font-sm"> Yu-gi-oh Trade Marketplace </span>
              </template>
            </q-tooltip>
          </span>
        </q-toolbar-title>

        <div v-if="!isLoading">
          <q-btn
            v-if="!sessionUser.id"
            class="bg-primary text-white"
            rounded
            label="login"
            @click="openLoginCard()"
          />

          <div
            v-else-if="sessionUser.id"
            class="row justify-end items-center q-gutter-x-sm cursor-pointer"
            @mouseenter="keepUserMenuOpen()"
            @mouseleave="closeUserMenuDebounced"
          >
            <span class="ellipsis gt-xs text-right ytm-font-sm" style="min-width: 130px">
              {{ sessionUser.name }}
            </span>
            <!-- <q-btn round> -->
            <q-avatar text-color="primary" icon="fa-solid fa-circle-user" size="3.4375 rem" />
            <!-- </q-btn> -->

            <q-menu
              v-model="isUserMenuOpen"
              fit
              square
              @mouseenter="keepUserMenuOpen"
              @mouseleave="closeUserMenuDebounced"
            >
              <q-list class="bg-secondary" style="min-width: 100px">
                <q-item
                  v-for="(option, i) in sessionUserMenuOptions"
                  :key="`option-${i}`"
                  class="text-white"
                  clickable
                  @click="option.action()"
                >
                  <q-item-section>{{ option.label }}</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="isLoginCardOpen" persistent>
      <login-card @close="isLoginCardOpen = false" @open-register="openRegisterCard()" />
    </q-dialog>

    <q-dialog v-model="isRegisterCardOpen">
      <register-card @close="isRegisterCardOpen = false" @login="openLoginCard()" />
    </q-dialog>
  </q-layout>
</template>
