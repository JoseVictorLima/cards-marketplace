<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import loginCard from 'src/pages/login/LoginCard.vue';
import registerCard from 'src/pages/login/RegisterCard.vue';
import services from 'src/services';
import type { IStores, IUser, IUtils } from 'src/interfaces';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t, locale } = useI18n();
const $services = services;
const $stores = inject('$stores') as IStores;
const $utils = inject('$utils') as IUtils;
const $router = useRouter();
const $route = useRoute();
const isLoginCardOpen = ref(false);
const isRegisterCardOpen = ref(false);
const sessionUser = ref<IUser>({} as IUser);
const isLoading = ref(true);
const isUserMenuOpen = ref(false);
const isTranslationMenuOpen = ref(false);
const userMenuTimerId = ref<NodeJS.Timeout>();
const translationMenuTimerId = ref<NodeJS.Timeout>();
const navigation = ref([
  {
    label: t('layouts.main_layout.navigation.trades'),
    action: async () => {
      await $router.push(`/trades`);
    },
  },
  {
    label: t('layouts.main_layout.navigation.cards'),
    action: async () => {
      await $router.push(`/cards`);
    },
  },
]);
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
const translationMenuOption = [
  {
    label: t('layouts.main_layout.translation.portuguese'),
    action: () => {
      if (locale.value != 'pt-BR') {
        localStorage.setItem('language', 'pt-BR');
        $router.go(0);
      }
    },
  },
  {
    label: t('layouts.main_layout.translation.english'),
    action: () => {
      if (locale.value != 'en-US') {
        localStorage.setItem('language', 'en-US');
        $router.go(0);
      }
    },
  },
];

const cartNumber = ref(0);

// Allows the user menu to remain active when the cursor moves from the menu to the items and vice versa.
const keepUserMenuOpen = () => {
  if (userMenuTimerId.value) {
    clearTimeout(userMenuTimerId.value);
  }
  if (!isUserMenuOpen.value) isUserMenuOpen.value = true;
};

// Closes the user menu after a specified period of time.
const closeUserMenuDebounced = () => {
  userMenuTimerId.value = setTimeout(() => {
    isUserMenuOpen.value = false;
  }, 50);
};

// Allows the transtation menu to remain active when the cursor moves from the menu to the items and vice versa.
const keepTranslationMenuOpen = () => {
  if (translationMenuTimerId.value) {
    clearTimeout(translationMenuTimerId.value);
  }
  if (!isTranslationMenuOpen.value) isTranslationMenuOpen.value = true;
};

// Closes the transtation menu after a specified period of time.
const closeTranslationMenuDebounced = () => {
  translationMenuTimerId.value = setTimeout(() => {
    isTranslationMenuOpen.value = false;
  }, 50);
};

async function logout() {
  $services.authentication.logout();
  $stores.useUser.resetSessionUser();
  $stores.useCart.emptyOfferingCart();
  sessionUser.value = {} as IUser;
  if ($route.path === '/trades') $router.go(0);
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

function cartSubscribe() {
  $stores.useCart.setCart();
  cartNumber.value = $stores.useCart.getCart.receiving.length;
  $stores.useCart.$subscribe((mutation, state) => {
    cartNumber.value = $stores.useCart.getCart.receiving.length;
    localStorage.setItem('cart', JSON.stringify(state));
  });
}

function layoutSubscribe() {
  $stores.useLayout.$subscribe(() => {
    openLoginCard();
  });
}

onMounted(async () => {
  isLoading.value = true;
  await getLoggedUser();
  cartSubscribe();
  layoutSubscribe();
  isLoading.value = false;
});
</script>
<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated>
      <div class="bg-secondary row text-white q-px-md">
        <q-toolbar class="row justify-between">
          <span
            class="ytm-font-lg cursor-pointer text-primary text-bold"
            @click="$router.push('/')"
          >
            YTM
            <q-tooltip>
              <template v-slot:default>
                <span class="ytm-font-sm"> Yu-gi-oh Trade Marketplace </span>
              </template>
            </q-tooltip>
          </span>

          <div v-if="!isLoading" class="row justify-center items-center q-gutter-x-sm">
            <div v-if="!sessionUser.id" class="row items-center">
              <q-btn class="bg-primary text-white" rounded label="login" @click="openLoginCard()" />
            </div>

            <div
              v-else-if="sessionUser.id"
              class="row justify-end items-center q-gutter-x-sm cursor-pointer"
              @mouseenter="keepUserMenuOpen()"
              @mouseleave="closeUserMenuDebounced"
            >
              <span class="ellipsis gt-xs text-right ytm-font-sm" style="min-width: 130px">
                {{ sessionUser.name }}
              </span>

              <q-avatar text-color="primary" icon="fa-solid fa-circle-user" size="3.4375 rem" />

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

            <div class="row items-center">
              <q-btn
                flat
                round
                color="white"
                icon="fa-solid fa-globe"
                @mouseenter="keepTranslationMenuOpen"
                @mouseleave="closeTranslationMenuDebounced"
              >
                <q-menu
                  v-model="isTranslationMenuOpen"
                  square
                  anchor="bottom left"
                  self="top middle"
                  @mouseenter="keepTranslationMenuOpen"
                  @mouseleave="closeTranslationMenuDebounced"
                >
                  <q-list class="bg-secondary">
                    <q-item
                      v-for="option in translationMenuOption"
                      :key="`translation-${option.label}`"
                      clickable
                      class="text-white"
                      @click="option.action"
                    >
                      <q-item-section>{{ option.label }}</q-item-section>
                    </q-item>
                    <q-separator />
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div class="row items-center">
              <q-btn
                flat
                round
                color="white"
                icon="fa-solid fa-cart-shopping"
                @click="$router.push('/cart')"
              >
                <q-badge
                  v-if="cartNumber > 0"
                  color="primary"
                  text-color="secondary"
                  floating
                  rounded
                >
                  <b>{{ cartNumber }}</b>
                </q-badge>
              </q-btn>
            </div>
          </div>
        </q-toolbar>
        <q-toolbar>
          <div class="col-12 row justify-around items-center q-px-md">
            <q-btn
              v-for="option in navigation"
              :key="`navigation-${option}`"
              flat
              color="accent"
              no-caps
              :label="option.label"
              @click="option.action()"
            />
          </div>
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <q-toolbar class="bg-secondary q-pa-md">
        <div class="ytm-font-sm" style="min-height: 100px">©2026 YTM Limitado</div>
      </q-toolbar>
    </q-footer>

    <q-dialog v-model="isLoginCardOpen" persistent>
      <login-card @close="isLoginCardOpen = false" @open-register="openRegisterCard()" />
    </q-dialog>

    <q-dialog v-model="isRegisterCardOpen">
      <register-card @close="isRegisterCardOpen = false" @login="openLoginCard()" />
    </q-dialog>
  </q-layout>
</template>
