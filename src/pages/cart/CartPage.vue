<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import type { ICard, IService, IStores, IUser, IUtils } from 'src/interfaces';
import cardView from 'src/components/card/CardView.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const $stores = inject('$stores') as IStores;
const $utils = inject('$utils') as IUtils;
const $services = inject('$services') as IService;
const $router = useRouter();
const { t } = useI18n();
const cart = ref({
  offering: [] as ICard[],
  receiving: [] as ICard[],
});
const selectedCards = ref([] as ICard[]);
const sessionUser = ref({} as IUser);
const sessionUserCards = ref([] as ICard[]);
const isAddCardOpen = ref(false);
const isTradeSaving = ref(false);

const isOfferingInvalid = computed(() => {
  return cart.value.receiving.some(
    (item) => cart.value.offering.findIndex((card) => card.id === item.id) != -1,
  );
});
const isReceivingInvalid = computed(() => {
  return sessionUserCards.value.some(
    (item) => cart.value.receiving.findIndex((card) => card.id === item.id) != -1,
  );
});

async function loading() {
  await getLoggedUser();
  loadCart();
  cartSubscribe();
}

async function getLoggedUser() {
  try {
    sessionUser.value = await $utils.sessionUser.getLoggedUser();
    if (sessionUser.value && sessionUser.value.id) await getUserCards();
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.get_user_data'),
      position: 'bottom',
    });
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
    $utils.notify.negative({
      message: t('errors.get_user_cards'),
      position: 'bottom',
      timeout: 3000,
    });
  }
}

function loadCart() {
  $stores.useCart.setCart();
  cart.value.receiving = [...$stores.useCart.getCart.receiving];
  cart.value.offering = [...$stores.useCart.getCart.offering];
  selectedCards.value = [...cart.value.offering];
}

function cartSubscribe() {
  $stores.useCart.$subscribe(() => {
    cart.value.receiving = [...$stores.useCart.getCart.receiving];
    cart.value.offering = [...$stores.useCart.getCart.offering];
    selectedCards.value = [...cart.value.offering];
  });
}

function removeItem(card: ICard, type: 'receiving' | 'offering') {
  if (type === 'receiving') {
    const index = $stores.useCart.getCart.receiving.findIndex((item) => item.id === card.id);
    if (index != -1) $stores.useCart.removeReceivingItem(card);
  }
  if (type === 'offering') {
    const index = $stores.useCart.getCart.offering.findIndex((item) => item.id === card.id);
    if (index != -1) $stores.useCart.removeOfferingItem(card);
  }
}

async function saveTrade() {
  isTradeSaving.value = true;
  try {
    const resp = await $services.trades.saveTrade(cart.value.offering, cart.value.receiving);
    if (
      resp != undefined &&
      typeof resp === 'object' &&
      'message' in resp &&
      typeof resp.message === 'string'
    ) {
      throw new Error(resp.message);
    }
    $utils.notify.positive({
      message: t('success.save_trade'),
      position: 'bottom',
    });
    $stores.useCart.emptyCart();
    await $router.push('/');
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.save_trade'),
      position: 'bottom',
      timeout: 3000,
    });
  }
  isTradeSaving.value = false;
}

// Checks if the cards are not duplicates or already owned by the user
function isInvalidItem(cardId: string, type: 'receiving' | 'offering') {
  if (sessionUserCards.value.length > 0) {
    if (type === 'receiving') {
      const index = sessionUserCards.value.findIndex((item) => item.id === cardId);
      if (index != -1) {
        return true;
      }
    }
    if (type === 'offering') {
      const index = cart.value.receiving.findIndex((item) => item.id === cardId);
      if (index != -1) {
        return true;
      }
    }
  }
  return false;
}

function openAddCard() {
  if (sessionUser.value === undefined) {
    $stores.useLayout.triggerLogin();
  } else isAddCardOpen.value = true;
}

function selectCard(card: ICard) {
  selectedCards.value.push(card);
}

function unselectCard(cardId: string) {
  const index = selectedCards.value.findIndex((item) => item.id === cardId);
  if (index != -1) {
    selectedCards.value.splice(index, 1);
  }
}

function confirmCards() {
  if (selectedCards.value.length === 0) $stores.useCart.emptyOfferingCart();
  else $stores.useCart.addOfferingItem(selectedCards.value);
  isAddCardOpen.value = false;
}

function isSelectedCard(cardId: string) {
  const index = selectedCards.value.findIndex((item) => item.id === cardId);
  if (index != -1) return true;
  return false;
}

onMounted(async () => {
  await loading();
});
</script>
<template>
  <div class="bg-grey-3 cart_body q-pa-md">
    <div class="row justify-center">
      <div
        :class="`${$q.screen.lt.sm ? 'col-12 reverse-wrap' : 'col-11'} row justify-between q-gutter-x-md`"
      >
        <div
          :class="`${$q.screen.lt.sm ? 'col-12 q-mt-md' : 'col'} column bg-white ytm-rounded-md q-pa-md cart_my_cart`"
        >
          <span class="ytm-font-lg text-primary">
            <b> {{ t('cart.title') }} </b>
          </span>

          <div>
            <!-- Receiving -->
            <div class="column q-my-sm">
              <span class="ytm-font-md"> {{ t('cart.receiving.title') }} </span>

              <div v-if="cart.receiving.length > 0">
                <!-- Invalid  receiving-->
                <span v-if="isReceivingInvalid" class="text-negative ytm-font-sm">
                  {{ t('cart.receiving.invalid') }}
                </span>
                <!-- Invalid  receiving-->

                <q-list separator class="q-mt-sm">
                  <q-item
                    v-for="rCard in cart.receiving"
                    :key="`receiving_${rCard.id}`"
                    :class="`row col-12 q-px-none q-py-sm ${isInvalidItem(rCard.id, 'receiving') ? 'cart_my_cart_list_item_invalid' : ''}`"
                  >
                    <div class="col-12 row justify-around items-center q-gutter-x-sm">
                      <div
                        :class="`col-10 row ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} items-start`"
                      >
                        <card-view :card="rCard" size="sm" no-details image-only />

                        <div
                          :class="`${$q.screen.lt.sm ? 'col-12' : 'col-8'} column items-start q-py-sm full-height`"
                        >
                          <span class="q-mb-sm ytm-font-sm">
                            <b>{{ rCard.name }}</b>
                          </span>

                          <div>
                            <span class="ytm-font-sm"> {{ t('cart.description') }} </span>
                            <p class="ytm-font-sm" style="white-space: pre-wrap">
                              {{ rCard.description }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        :class="`${$q.screen.lt.sm ? 'col-12 row justify-center items-center' : ''} `"
                      >
                        <q-btn
                          :disable="isTradeSaving"
                          size="sm"
                          flat
                          round
                          color="secondary"
                          icon="fa-solid fa-trash"
                          @click="removeItem(rCard, 'receiving')"
                        />
                      </div>
                    </div>
                  </q-item>
                </q-list>
              </div>

              <div v-else>
                <div class="text-center q-py-md text-grey-7">
                  <h3 class="ytm-font-md q-mb-none">{{ t('cart.no_selected') }}</h3>
                  <span class="ytm-font-sm">
                    {{ t('cart.receiving.info.prefix') }}
                    <router-link :class="isTradeSaving ? 'no-pointer-events' : ''" to="/cards"
                      ><b>{{ t('cart.receiving.info.link') }}</b></router-link
                    >
                    {{ t('cart.receiving.info.suffix') }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Receiving -->

            <q-separator color="grey-4" />

            <!-- Offering -->
            <div class="column q-my-sm">
              <div class="row items-center q-gutter-x-sm">
                <span class="ytm-font-md"> {{ t('cart.offering.title') }} </span>
                <q-btn
                  :disable="isTradeSaving"
                  round
                  flat
                  color="primary"
                  size="sm"
                  icon="fa-solid fa-plus"
                  @click="openAddCard()"
                />
              </div>

              <div v-if="cart.offering.length > 0">
                <!-- Invalid  offering-->
                <span v-if="isOfferingInvalid" class="text-negative ytm-font-sm">
                  {{ t('cart.offering.invalid') }}
                </span>
                <!-- Invalid  offering-->
                <q-list separator class="q-mt-sm">
                  <q-item
                    v-for="oCard in cart.offering"
                    :key="`offering_${oCard.id}`"
                    :class="`row col-12 q-px-none q-py-sm ${isInvalidItem(oCard.id, 'offering') ? 'cart_my_cart_list_item_invalid' : ''}`"
                  >
                    <div class="col-12 row justify-around items-center q-gutter-x-sm">
                      <div
                        :class="`col-10 row ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} items-start`"
                      >
                        <card-view :card="oCard" size="sm" no-details image-only />

                        <div
                          :class="`${$q.screen.lt.sm ? 'col-12' : 'col-8'} column items-start q-py-sm full-height`"
                        >
                          <span class="q-mb-sm ytm-font-sm">
                            <b>{{ oCard.name }}</b>
                          </span>

                          <div>
                            <span class="ytm-font-sm"> {{ t('cart.description') }} </span>
                            <p class="ytm-font-sm" style="white-space: pre-wrap">
                              {{ oCard.description }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        :class="`${$q.screen.lt.sm ? 'col-12 row justify-center items-center' : ''} `"
                      >
                        <q-btn
                          :disable="isTradeSaving"
                          size="sm"
                          flat
                          round
                          color="secondary"
                          icon="fa-solid fa-trash"
                          @click="removeItem(oCard, 'offering')"
                        />
                      </div>
                    </div>
                  </q-item>
                </q-list>
              </div>

              <div v-else>
                <div class="text-center q-py-md text-grey-7">
                  <h3 class="ytm-font-md q-mb-none">{{ t('cart.no_selected') }}</h3>
                  <span class="ytm-font-sm">
                    {{ t('cart.offering.info') }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Offering -->
          </div>
        </div>

        <div
          :class="`${$q.screen.lt.sm ? 'col-12' : ''} row justify-center items-center bg-white ytm-rounded-md q-pa-md`"
          style="max-height: 80px"
        >
          <q-btn
            :loading="isTradeSaving"
            :disable="
              cart.receiving.length === 0 ||
              cart.offering.length === 0 ||
              isOfferingInvalid ||
              isReceivingInvalid ||
              isTradeSaving
            "
            rounded
            color="primary"
            :label="t('cart.submit')"
            @click="saveTrade()"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Select cards -->
  <q-dialog
    v-model="isAddCardOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-pa-lg">
      <div class="row items-center justify-center">
        <div
          :class="`col-12 row ${$q.screen.lt.sm ? 'justify-center q-gutter-sm' : 'justify-between'} q-mb-md`"
        >
          <span :class="`${$q.screen.lt.sm ? 'col-12' : ''} text-primary ytm-font-lg`">
            <b> {{ t('cart.select.title') }} </b>
          </span>

          <q-btn
            flat
            round
            color="secondary"
            icon="fa-solid fa-xmark"
            @click="isAddCardOpen = false"
          />
        </div>

        <div
          class="col-12 row justify-center relative-position profile_add_card_card_display"
          style="height: 75vh"
        >
          <q-scroll-area class="absolute-full bg-grey-3 q-pa-sm">
            <div v-if="sessionUserCards.length > 0" class="row justify-center">
              <ul
                :class="`row ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} items-center cart_my_cart_list`"
              >
                <li
                  v-for="sCard in sessionUserCards"
                  :key="`user_card_${sCard.id}`"
                  :class="`cursor-pointer cart_my_cart_list_item ${isSelectedCard(sCard.id) === true ? 'card_selected' : 'card_unselected'}`"
                  @click="isSelectedCard(sCard.id) ? unselectCard(sCard.id) : selectCard(sCard)"
                >
                  <card-view :card="sCard" image-only no-details size="sm" />
                </li>
              </ul>
            </div>

            <div v-else class="absolute-full column items-center justify-center">
              <div class="text-center q-pb-md text-grey-7">
                <h3 class="ytm-font-md q-my-none">{{ t('cart.select.no_card') }}</h3>
                <span class="ytm-font-sm">
                  {{ t('cart.select.info.prefix') }}
                  <router-link :to="`/profile/${sessionUser.name}`">
                    <b>{{ t('cart.select.info.link') }}</b>
                  </router-link>
                </span>
              </div>
            </div>
          </q-scroll-area>
        </div>
      </div>
      <q-card-actions class="col-12 self-end" align="right">
        <q-btn color="primary" rounded :label="t('cart.select.confirm')" @click="confirmCards" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Select cards -->
</template>
<style scoped lang="scss">
.cart {
  &_body {
    height: 100%;
    min-height: 94vh;
  }
  &_my_cart {
    width: 900px;
    &_list {
      list-style: none;
      gap: 0.8rem;
      padding: 0;
      margin: 0;
      max-width: 65rem;
      &_item {
        max-width: 14rem;
        &_invalid {
          border-color: $negative !important;
          border-style: solid;
          border-width: 2px;
          border-top: 2px solid $negative !important;
          border-bottom: 2px solid $negative !important;
        }
      }
    }
  }
}
.card {
  &_unselected {
    border-color: rgba(0, 0, 0, 0);
    border-style: solid;
    border-width: 2px;
    &:hover {
      border-color: $grey-5;
    }
  }
  &_selected {
    border-color: rgba(0, 0, 0, 0);
    border-style: solid;
    border-width: 2px;
    background-color: $green-12;
  }
}
</style>
