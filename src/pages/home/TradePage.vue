<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { IService, ITrade, IUser, IUtils } from 'src/interfaces';
import { useI18n } from 'vue-i18n';
import cardView from 'src/components/card/CardView.vue';

const $services = inject('$services') as IService;
const $utils = inject('$utils') as IUtils;
const { locale, t } = useI18n();
const tradeFilter = ref({
  rpp: 10,
  page: 1,
  more: true,
});
const itemsPerPage = ref([10, 20, 50]);
const isLoadingGetTrades = ref(false);
const isTradesLoading = ref(false);
const trades = ref([] as ITrade[]);
const sessionUser = ref({} as IUser);
const tradeIdToDelete = ref('');
const isDeleteTradeDialogOpen = ref(false);
const isDeletingTrade = ref(false);

async function loading() {
  isTradesLoading.value = true;
  await getLoggedUser();
  await getTrades();
  isTradesLoading.value = false;
}

async function getLoggedUser() {
  try {
    sessionUser.value = await $utils.sessionUser.getLoggedUser();
  } catch (error) {
    console.log(error);
  }
}

async function getTrades(directive?: 'next' | 'previous') {
  isLoadingGetTrades.value = true;
  window.scrollTo(0, 0.01);
  try {
    switch (directive) {
      case 'next':
        tradeFilter.value.page++;
        break;
      case 'previous':
        tradeFilter.value.page--;
        break;
      default:
        tradeFilter.value.page = 1;
        break;
    }
    const resp = await $services.trades.getTrades(tradeFilter.value);
    if (resp && resp.list) {
      trades.value = resp.list;
      tradeFilter.value.more = resp.more;
    }
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.load_trade'),
      position: 'bottom',
    });
  }
  isLoadingGetTrades.value = false;
}

function openDeleteTradeDialog(tradeId: string) {
  tradeIdToDelete.value = tradeId;
  isDeleteTradeDialogOpen.value = true;
}

function closeDeleteTradeDialog() {
  tradeIdToDelete.value = '';
  isDeleteTradeDialogOpen.value = false;
}

async function deleteTrade() {
  isDeletingTrade.value = true;
  try {
    const resp = await $services.trades.deleteTrade(tradeIdToDelete.value);
    if (resp != undefined && typeof resp === 'object') {
      throw new Error(resp);
    }
    $utils.notify.positive({
      message: t('success.delete_trade'),
      position: 'bottom',
    });
    closeDeleteTradeDialog();
    await loading();
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.delete_trade'),
      position: 'bottom',
    });
    closeDeleteTradeDialog();
  }
  isDeletingTrade.value = false;
}

function showDate(date: string) {
  const showDate = new Date(date);
  const year = showDate.getFullYear();
  const month = (showDate.getMonth() + 1).toString().padStart(2, '0');
  const day = showDate.getDate().toString().padStart(2, '0');
  if (locale.value === 'pt-BR') {
    return `${day}/${month}/${year}`;
  } else {
    return `${month}/${day}/${year}`;
  }
}

onMounted(async () => {
  await loading();
});
</script>
<template>
  <div class="q-px-sm q-py-md relative-position home_trade_body bg-grey-2">
    <div class="q-mt-sm q-mb-lg">
      <span class="text-primary q-px-md ytm-font-lg"
        ><b>{{ t('home.trades.title') }}</b></span
      >
    </div>

    <!-- Top Pagination -->
    <div
      v-if="!isLoadingGetTrades && trades.length > 0"
      :class="`q-my-md q-px-md col-12 row ${$q.screen.lt.sm ? 'justify-center q-gutter-sm' : 'justify-between'}`"
    >
      <div class="row items-center q-gutter-x-sm">
        <q-select
          v-model="tradeFilter.rpp"
          :options="itemsPerPage"
          outlined
          dense
          @update:model-value="getTrades()"
        />
        <span v-if="$q.screen.gt.xs" class="ytm-font-sm">
          {{ t('home.trades.filter.items_per_page') }}
        </span>
      </div>

      <div class="q-gutter-x-sm row justify-center items-center">
        <q-btn
          flat
          :disable="tradeFilter.page === 1"
          :rounded="$q.screen.gt.xs ? true : false"
          :round="$q.screen.gt.xs ? false : true"
          color="primary"
          icon="fa-solid fa-arrow-left-long"
          no-caps
          class="ytm-font-md"
          :label="$q.screen.gt.xs ? t('home.trades.pagination.previous') : undefined"
          @click="getTrades('previous')"
        />

        <span v-if="$q.screen.gt.xs" class="ytm-font-md text-primary">
          <b>{{ tradeFilter.page }}</b>
        </span>

        <q-btn
          flat
          :disable="tradeFilter.more === false"
          :rounded="$q.screen.gt.xs ? true : false"
          :round="$q.screen.gt.xs ? false : true"
          color="primary"
          :icon="$q.screen.gt.xs ? undefined : 'fa-solid fa-arrow-right-long'"
          icon-right="fa-solid fa-arrow-right-long"
          no-caps
          class="ytm-font-md"
          :label="$q.screen.gt.xs ? t('home.trades.pagination.next') : undefined"
          @click="getTrades('next')"
        />
      </div>
    </div>
    <!-- Top Pagination -->

    <!-- Loading -->
    <div
      v-if="isTradesLoading || isLoadingGetTrades"
      class="q-pa-md absolute-full flex flex-center"
    >
      <q-spinner color="primary" size="50px" />
    </div>
    <!-- Loading -->

    <div v-else>
      <div v-if="trades.length > 0" class="row justify-center q-px-md">
        <ul class="col-12 column home_trade_list">
          <li v-for="trade in trades" :key="trade.id" class="column home_trade_list_item">
            <div
              :class="`row ${$q.screen.lt.sm ? 'justify-center' : 'justify-between'} bg-grey-4 q-pa-md`"
            >
              <div :class="`column ${$q.screen.lt.sm ? 'col-12 items-center' : ''}`">
                <span class="ytm-font-md">
                  <b>{{ t('home.trades.name') }}</b> {{ trade.user.name }}
                </span>
                <span class="ytm-font-sm">
                  <b>{{ t('home.trades.date') }}</b> {{ showDate(trade.createdAt) }}</span
                >
              </div>
              <div v-if="sessionUser && trade.userId === sessionUser.id" class="q-mx-sm">
                <q-btn
                  flat
                  round
                  color="secondary"
                  icon="fa-solid fa-trash"
                  @click="openDeleteTradeDialog(trade.id)"
                />
              </div>
            </div>

            <!-- OFFERING -->
            <div :class="`column q-px-md q-py-sm ${$q.screen.lt.sm ? 'items-center' : ''}`">
              <span class="ytm-font-md">{{ t('home.trades.offering') }}</span>

              <ul
                :class="`${$q.screen.lt.sm ? 'column' : 'row justify-start'} home_trade_list_card_list q-px-none q-gutter-x-sm`"
              >
                <li
                  v-for="card in trade.tradeCards.filter((item) => item.type === 'OFFERING')"
                  :key="`trade-${trade.id}-card-${card.id}`"
                >
                  <card-view :card="card.card" image-only size="sm" />
                </li>
              </ul>
            </div>
            <!-- OFFERING -->

            <q-separator color="grey-4" />

            <!-- RECEIVING -->
            <div :class="`column q-px-md q-py-sm ${$q.screen.lt.sm ? 'items-center' : ''}`">
              <span class="ytm-font-md">{{ t('home.trades.receiving') }}</span>

              <ul
                :class="`${$q.screen.lt.sm ? 'column' : 'row justify-start'} home_trade_list_card_list q-px-none`"
              >
                <li
                  v-for="card in trade.tradeCards.filter((item) => item.type === 'RECEIVING')"
                  :key="`trade-${trade.id}-card-${card.id}`"
                >
                  <card-view :card="card.card" image-only size="sm" />
                </li>
              </ul>
            </div>
            <!-- RECEIVING -->
          </li>
        </ul>
      </div>

      <div v-else class="absolute-full flex flex-center">
        <div class="text-center q-py-md text-grey-7">
          <h3 class="ytm-font-md">{{ t('home.trades.no_trades') }}</h3>
          <q-icon name="fa-regular fa-face-frown" size="xl" />
        </div>
      </div>

      <!-- Bottom Pagination -->
      <div
        v-if="!isLoadingGetTrades && trades.length > 0"
        :class="`q-my-md q-px-md col-12 row items-center ${$q.screen.lt.sm ? 'justify-center' : 'justify-end'} q-gutter-x-sm`"
      >
        <q-btn
          flat
          :disable="tradeFilter.page === 1"
          :rounded="$q.screen.gt.xs ? true : false"
          :round="$q.screen.gt.xs ? false : true"
          color="primary"
          icon="fa-solid fa-arrow-left-long"
          no-caps
          class="ytm-font-md"
          :label="$q.screen.gt.xs ? 'Anterior' : undefined"
          @click="getTrades('previous')"
        />

        <span v-if="$q.screen.gt.xs" class="ytm-font-md text-primary">
          <b>{{ tradeFilter.page }}</b>
        </span>

        <q-btn
          flat
          :disable="tradeFilter.more === false"
          :rounded="$q.screen.gt.xs ? true : false"
          :round="$q.screen.gt.xs ? false : true"
          color="primary"
          :icon="$q.screen.gt.xs ? undefined : 'fa-solid fa-arrow-right-long'"
          icon-right="fa-solid fa-arrow-right-long"
          no-caps
          class="ytm-font-md"
          :label="$q.screen.gt.xs ? 'Próxima' : undefined"
          @click="getTrades('next')"
        />
      </div>
      <!-- Bottom Pagination -->
    </div>
  </div>

  <q-dialog v-model="isDeleteTradeDialogOpen" persistent>
    <q-card class="ytm-rounded-md home_trade_delete_dialog q-px-md">
      <q-card-section class="row justify-center items-center">
        <span class="ytm-font-lg text-negative">
          <b>{{ t('home.trades.delete.title') }}</b>
        </span>
      </q-card-section>
      <q-card-section class="column justify-start q-pb-sm">
        <p class="ytm-font-md q-mb-xs">{{ t('home.trades.delete.description') }}</p>
        <p class="ytm-font-sm">{{ t('home.trades.delete.info') }}</p>
      </q-card-section>
      <q-card-actions align="between">
        <q-btn
          :disable="isDeletingTrade"
          rounded
          flat
          :label="t('home.trades.delete.cancel')"
          color="primary"
          @click="closeDeleteTradeDialog()"
        />
        <q-btn
          :loading="isDeletingTrade"
          :disable="isDeletingTrade"
          rounded
          flat
          :label="t('home.trades.delete.delete')"
          color="negative"
          @click="deleteTrade()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped lang="scss">
ul {
  list-style-type: none;
}
.home_trade {
  &_body {
    height: 100%;
    min-height: 97.3vh;
  }
  &_list {
    gap: 0.8rem;
    padding: 0;
    margin: 0;
    &_item {
      border-color: $grey-4;
      border-width: 1px;
      border-style: solid;
      min-height: 100px;
      width: 100%;
      &_card_list {
        gap: 0.8rem;
        padding: 0;
        margin: 0;
      }
    }
  }
  &_delete_dialog {
    min-width: 235px;
  }
}
</style>
