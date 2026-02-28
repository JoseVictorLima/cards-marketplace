<script setup lang="ts">
import { ref, onMounted, inject, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { ICard, IService, IStores, IUser } from 'src/interfaces';
import CardView from 'src/components/card/CardView.vue';

const $route = useRoute();
const $stores = inject('$stores') as IStores;
const $services = inject('$services') as IService;
const pageUser = ref({} as IUser);
const pageUserCards = ref([] as ICard[]);
const sessionUser = ref({} as IUser);
const activeTab = ref('cards');

async function loadPage() {
  await getLoggedUser();
  getProfileUser();
  await getProfileCards();
}

//Load profile user's data
function getProfileUser() {
  if (sessionUser.value && $route.params.name === sessionUser.value.name) {
    // Load logged user page info
    pageUser.value = sessionUser.value;
  } else {
    // Load other user's page info
    if ($route.params.name) pageUser.value.name = $route.params.name as string;
  }
  pageUser.value.name = $route.params.name as string;
}

// Checks if the access token is still valid and then loads the logged user.
async function getLoggedUser() {
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

async function getProfileCards() {
  try {
    const resp = await $services.card.getCards({ rpp: 41, page: 1 });
    if (resp) {
      pageUserCards.value = resp.list;
    }
    // const resp = await $services.me.getSessionUserCards();
    // console.log(resp);
  } catch (error) {
    console.log(error);
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
  <div class="bg-grey-3" style="min-height: 94vh">
    <div :class="`row justify-center content-center bg-secondary `" style="min-height: 200px">
      <div class="col-12 row justify-center">
        <q-avatar class="text-primary" icon="fa-solid fa-circle-user" size="11rem" />
      </div>
      <span class="col-12 text-white text-center" style="font-size: 20px">
        {{ pageUser.name }}
      </span>
    </div>
    <q-separator color="grey-9" />
    <div class="bg-secondary row justify-center q-py-xs">
      <q-tabs class="text-white" v-model="activeTab">
        <q-tab
          name="cards"
          icon="fa-solid fa-layer-group"
          :label="$q.screen.gt.xs ? 'Cartas' : ''"
        />
        <q-tab
          name="trades"
          icon="fa-solid fa-handshake"
          :label="$q.screen.gt.xs ? 'Trocas' : ''"
        />
      </q-tabs>
    </div>
    <div class="">
      <q-tab-panels
        v-model="activeTab"
        keep-alive
        :keep-alive-include="['cards', 'trades']"
        animated
        class="bg-grey-3"
      >
        <q-tab-panel name="cards">
          <div class="col-12 row justify-center q-px-md q-mx-xl">
            <div
              :class="`col-12 row ${$q.screen.lt.sm ? 'justify-center' : 'justify-between'} q-mb-sm q-gutter-x-sm`"
            >
              <h3 class="text-primary q-my-none" style="font-size: 2rem">Minhas cartas</h3>
              <div class="row items-center">
                <q-btn
                  flat
                  color="primary"
                  :round="$q.screen.gt.xs ? false : true"
                  :rounded="$q.screen.gt.xs ? true : false"
                  icon="fa-solid fa-plus"
                  :label="$q.screen.gt.xs ? 'Adicionar carta' : ''"
                >
                  <q-tooltip v-if="$q.screen.lt.sm"> Adicionar carta </q-tooltip>
                </q-btn>
              </div>
            </div>
            <ul
              :class="`col-xs-12 col-sm-11 row ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} items-center`"
              style="list-style: none; gap: 0.8rem; padding: 0; margin: 0"
            >
              <li
                :class="`${$q.screen.lt.sm ? 'col-12 row justify-center' : ''}`"
                v-for="card in pageUserCards"
                :key="card.id"
              >
                <card-view :card="card" size="sm" />
              </li>
            </ul>
          </div>
        </q-tab-panel>
        <q-tab-panel name="trades"> Minhas trocas </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
