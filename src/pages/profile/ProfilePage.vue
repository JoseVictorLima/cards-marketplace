<script setup lang="ts">
import { ref, onMounted, inject, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { IService, IStores, IUser } from 'src/interfaces';
import profileCards from './ProfileCards.vue';
import { useI18n } from 'vue-i18n';

const $route = useRoute();
const $stores = inject('$stores') as IStores;
const $services = inject('$services') as IService;
const { t } = useI18n();
const profileUser = ref({} as IUser);
const sessionUser = ref({} as IUser);
const isSessonUser = ref(false);
const activeTab = ref('cards');
const isProfileLoading = ref(true);

const profileCardsKey = ref(0);

async function loadPage() {
  isProfileLoading.value = true;
  await getLoggedUser();
  getProfileUser();
  isProfileLoading.value = false;
}

//Load profile user's data
function getProfileUser() {
  if (sessionUser.value && $route.params.name === sessionUser.value.name) {
    // Load logged user page info
    profileUser.value = sessionUser.value;
    isSessonUser.value = true;
  } else {
    // Load other user's page info
    if ($route.params.name) profileUser.value.name = $route.params.name as string;
    isSessonUser.value = false;
  }
  profileUser.value.name = $route.params.name as string;
}

// Checks if the access token is still valid and then loads the logged user.
async function getLoggedUser() {
  if (!sessionUser.value.id) {
    const token = $services.authentication.getAccessToken();
    if (!!token && !$services.authentication.isTokenExpired(token)) {
      if (!$stores.useUser.getSessionUser.id) {
        try {
          await $stores.useUser.setSessionUser();
          sessionUser.value = $stores.useUser.getSessionUser;
        } catch (error) {
          console.log(error);
        }
      } else {
        sessionUser.value = $stores.useUser.getSessionUser;
      }
    }
  }
}

watch(
  () => $route.params.name,
  async (newValue, oldValue) => {
    if (newValue != oldValue) {
      await loadPage();
    }
  },
);

onMounted(async () => {
  await loadPage();
});
</script>
<template>
  <div class="column bg-grey-3 profile_body">
    <!-- Loading -->
    <div
      v-if="isProfileLoading"
      class="row justify-center content-center bg-secondary q-pb-sm profile_card"
    >
      <div class="col-12 row justify-center q-my-md">
        <q-skeleton type="QAvatar" size="8rem" />
      </div>
      <span class="col-12 text-white row justify-center">
        <q-skeleton type="text" width="200px" height="30px" />
      </span>
    </div>
    <!-- Loading -->

    <div v-else class="row justify-center content-center bg-secondary q-pb-sm profile_card">
      <div class="col-12 row justify-center q-my-md">
        <q-icon class="text-primary" name="fa-solid fa-circle-user" size="8rem" />
      </div>
      <span class="col-12 text-white text-center ytm-font-lg">
        {{ profileUser.name }}
      </span>
    </div>

    <q-separator color="grey-9" />
    <div class="bg-secondary row justify-center q-py-xs">
      <q-tabs class="text-white" v-model="activeTab">
        <q-tab
          :disable="isProfileLoading"
          name="cards"
          icon="fa-solid fa-layer-group"
          :label="$q.screen.gt.xs ? t('profile.tabs.cards') : ''"
        />
        <q-tab
          :disable="isProfileLoading"
          name="trades"
          icon="fa-solid fa-handshake"
          :label="$q.screen.gt.xs ? t('profile.tabs.trades') : ''"
        />
      </q-tabs>
    </div>

    <!-- Loading -->
    <div v-if="isProfileLoading" class="col-grow column justify-center items-center q-pa-md">
      <q-spinner color="primary" size="50px" />
    </div>
    <!-- Loading -->

    <div v-else class="col-grow column">
      <q-tab-panels
        v-model="activeTab"
        keep-alive
        :keep-alive-include="['cards', 'trades']"
        animated
        class="col bg-grey-3"
      >
        <q-tab-panel name="cards">
          <profile-cards
            :profile-name="profileUser.name"
            :isSessionUser="isSessonUser"
            :key="profileCardsKey"
          />
        </q-tab-panel>
        <q-tab-panel name="trades"> Minhas trocas </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<style scoped lang="scss">
.profile {
  &_body {
    min-height: 94vh;
  }
  &_card {
    min-height: 200px;
  }
}
</style>
