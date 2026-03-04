<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import type { ICard, IService, IStores, IUser, IUtils } from 'src/interfaces';
import { useI18n } from 'vue-i18n';
import cardView from 'src/components/card/CardView.vue';

const $services = inject('$services') as IService;
const $utils = inject('$utils') as IUtils;
const $stores = inject('$stores') as IStores;
const { t } = useI18n();
const cardFilter = ref({
  rpp: 30,
  page: 1,
  more: true,
});
const itemsPerPage = ref([30, 50, 100]);
const isCardLoading = ref(false);
const isLoadingGetCards = ref(false);
const cards = ref<ICard[]>([] as ICard[]);
const sessionUser = ref({} as IUser);
const sessionUserCards = ref([] as ICard[]);
const hoverItem = ref('');
const keyTradeButton = ref();

async function loading() {
  isCardLoading.value = true;
  await getLoggedUser();
  await getCards();
  isCardLoading.value = false;
}

async function getLoggedUser() {
  try {
    sessionUser.value = await $utils.sessionUser.getLoggedUser();
    if (sessionUser.value && sessionUser.value.id) await getUserCards();
  } catch (error) {
    console.log(error);
  }
}

async function getUserCards() {
  try {
    const resp = await $services.me.getSessionUserCards();
    if (resp && resp.length > 0) {
      sessionUserCards.value = resp;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCards(directive?: 'next' | 'previous') {
  isLoadingGetCards.value = true;
  window.scrollTo(0, 0.01);
  try {
    switch (directive) {
      case 'next':
        cardFilter.value.page++;
        break;
      case 'previous':
        cardFilter.value.page--;
        break;
      default:
        cardFilter.value.page = 1;
        break;
    }
    const resp = await $services.card.getCards(cardFilter.value);
    if (resp && resp.list) {
      cards.value = resp.list;
      cardFilter.value.more = resp.more;
    }
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.get_cards'),
      position: 'bottom',
    });
  }
  isLoadingGetCards.value = false;
}

function isAcquiredCard(cardId: string) {
  if (sessionUserCards.value && sessionUserCards.value.length > 0) {
    const index = sessionUserCards.value.findIndex((item) => item.id === cardId);
    if (index != -1) return true;
  }
  return false;
}

function addCard(card: ICard) {
  $stores.useCart.addReceivingItem(card);
  keyTradeButton.value = new Date();
}

//Check if the card is in the user's cart.
function isCardOnCart(cardId: string) {
  return $stores.useCart.getCart.receiving.findIndex((item) => item.id === cardId) != -1;
}

onMounted(async () => {
  await loading();
});
</script>
<template>
  <div class="q-px-sm q-py-md relative-position home_card_body bg-grey-2">
    <div class="q-mt-sm q-mb-lg">
      <span class="text-primary q-px-md ytm-font-lg"
        ><b>{{ t('home.cards.title') }}</b></span
      >
    </div>

    <!-- Top Pagination -->
    <div
      v-if="!isLoadingGetCards && cards.length > 0"
      :class="`q-my-md q-px-md col-12 row ${$q.screen.lt.sm ? 'justify-center q-gutter-sm' : 'justify-between'}`"
    >
      <div class="row items-center q-gutter-x-sm">
        <q-select
          v-model="cardFilter.rpp"
          :options="itemsPerPage"
          outlined
          dense
          @update:model-value="getCards()"
        />
        <span v-if="$q.screen.gt.xs" class="ytm-font-sm">
          {{ t('home.trades.filter.items_per_page') }}
        </span>
      </div>

      <div class="q-gutter-x-sm row justify-center items-center">
        <q-btn
          flat
          :disable="cardFilter.page === 1"
          :rounded="$q.screen.gt.xs ? true : false"
          :round="$q.screen.gt.xs ? false : true"
          color="primary"
          icon="fa-solid fa-arrow-left-long"
          no-caps
          class="ytm-font-md"
          :label="$q.screen.gt.xs ? t('home.trades.pagination.previous') : undefined"
          @click="getCards('previous')"
        />

        <span v-if="$q.screen.gt.xs" class="ytm-font-md text-primary">
          <b>{{ cardFilter.page }}</b>
        </span>

        <q-btn
          flat
          :disable="cardFilter.more === false"
          :rounded="$q.screen.gt.xs ? true : false"
          :round="$q.screen.gt.xs ? false : true"
          color="primary"
          :icon="$q.screen.gt.xs ? undefined : 'fa-solid fa-arrow-right-long'"
          icon-right="fa-solid fa-arrow-right-long"
          no-caps
          class="ytm-font-md"
          :label="$q.screen.gt.xs ? t('home.trades.pagination.next') : undefined"
          @click="getCards('next')"
        />
      </div>
    </div>
    <!-- Top Pagination -->

    <!-- Loading -->

    <div v-if="isCardLoading || isLoadingGetCards" class="q-pa-md absolute-full flex flex-center">
      <q-spinner color="primary" size="50px" />
    </div>
    <!-- Loading -->

    <div v-else>
      <div v-if="cards.length > 0" class="row justify-center q-px-sm">
        <ul
          :class="`row ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} items-center home_card_list`"
        >
          <li
            :class="`${$q.screen.lt.sm ? 'col-12 row justify-center' : ''} home_card_list_item relative-position`"
            v-for="card in cards"
            :key="card.id"
            @mouseenter="hoverItem = card.id"
            @mouseleave="hoverItem = ''"
          >
            <card-view :card="card" />

            <q-btn
              v-if="hoverItem != '' && hoverItem === card.id"
              :class="`absolute full-width ${isCardOnCart(card.id) || isAcquiredCard(card.id) ? 'bg-grey-6 ' : 'bg-primary'} home_card_list_item_button`"
              flat
              color="white"
              :icon="
                isCardOnCart(card.id) || isAcquiredCard(card.id)
                  ? undefined
                  : 'fa-solid fa-cart-shopping'
              "
              :label="
                isAcquiredCard(card.id)
                  ? t('home.cards.button.owns')
                  : isCardOnCart(card.id)
                    ? t('home.cards.button.cart')
                    : t('home.cards.button.trade')
              "
              :key="keyTradeButton"
              @click="isCardOnCart(card.id) || isAcquiredCard(card.id) ? null : addCard(card)"
            />
          </li>
        </ul>
      </div>

      <div v-else class="absolute-full flex flex-center">
        <div class="text-center q-py-md text-grey-7">
          <h3 class="ytm-font-md">{{ t('home.cards.no_cards') }}</h3>
          <q-icon name="fa-regular fa-face-frown" size="xl" />
        </div>
      </div>
    </div>

    <!-- Bottom Pagination -->
    <div
      v-if="!isLoadingGetCards && cards.length > 0"
      :class="`q-my-md q-px-md col-12 row items-center ${$q.screen.lt.sm ? 'justify-center' : 'justify-end'} q-gutter-x-sm`"
    >
      <q-btn
        flat
        :disable="cardFilter.page === 1"
        :rounded="$q.screen.gt.xs ? true : false"
        :round="$q.screen.gt.xs ? false : true"
        color="primary"
        icon="fa-solid fa-arrow-left-long"
        no-caps
        class="ytm-font-md"
        :label="$q.screen.gt.xs ? t('home.trades.pagination.previous') : undefined"
        @click="getCards('previous')"
      />

      <span v-if="$q.screen.gt.xs" class="ytm-font-md text-primary">
        <b>{{ cardFilter.page }}</b>
      </span>

      <q-btn
        flat
        :disable="cardFilter.more === false"
        :rounded="$q.screen.gt.xs ? true : false"
        :round="$q.screen.gt.xs ? false : true"
        color="primary"
        :icon="$q.screen.gt.xs ? undefined : 'fa-solid fa-arrow-right-long'"
        icon-right="fa-solid fa-arrow-right-long"
        no-caps
        class="ytm-font-md"
        :label="$q.screen.gt.xs ? t('home.trades.pagination.next') : undefined"
        @click="getCards('next')"
      />
    </div>
    <!-- Bottom Pagination -->
  </div>
</template>
<style scoped lang="scss">
.q-btn--no-shadow {
  box-shadow: none !important;
}
.home_card {
  &_body {
    height: 100%;
    min-height: 97.3vh;
  }
  &_list {
    list-style: none;
    gap: 0.8rem;
    padding: 0;
    margin: 0;
    max-width: 65rem;
    &_item {
      max-width: 13rem;
      border-color: rgba(0, 0, 0, 0);
      border-style: solid;
      border-width: 2px;
      &:hover {
        border-color: $primary;
      }
      &_button {
        top: 70%;
        border-radius: 0px;
      }
    }
  }
}
</style>
