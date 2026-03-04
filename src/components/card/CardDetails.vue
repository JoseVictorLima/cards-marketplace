<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { ICard, IStores, IUser, IUtils } from 'src/interfaces';
import { useI18n } from 'vue-i18n';
interface props {
  card: ICard;
}

const props = withDefaults(defineProps<props>(), {
  card: () => {
    return {} as ICard;
  },
});
const $emit = defineEmits<(e: 'close') => void>();
const $utils = inject('$utils') as IUtils;
const $stores = inject('$stores') as IStores;
const isAllowTrade = inject('$allow-details-trade', false);
const sessionUser = ref({} as IUser);
const keyDetailsTradeButton = ref();
const { t } = useI18n();

async function getLoggedUser() {
  try {
    sessionUser.value = await $utils.sessionUser.getLoggedUser();
  } catch (error) {
    console.log(error);
  }
}

function isCardOnCart() {
  return $stores.useCart.getCart.receiving.findIndex((item) => item.id === props.card.id) != -1;
}

function isAcquiredCard() {
  if (sessionUser.value && sessionUser.value.cards && sessionUser.value.cards?.length > 0) {
    const index = sessionUser.value.cards.findIndex((item) => item.id === props.card.id);
    if (index != -1) return true;
  }
  return false;
}

function addCard() {
  $stores.useCart.addReceivingItem(props.card);
  keyDetailsTradeButton.value = new Date();
}
onMounted(async () => {
  if (isAllowTrade) await getLoggedUser();
});
</script>
<template>
  <div class="card_details_body q-pa-md">
    <div class="row justify-center items-start">
      <div class="col-12 col-md-6 row justify-center q-mb-sm">
        <q-img :src="card.imageUrl" class="card_details_image" />

        <div
          v-if="isAllowTrade"
          :class="`col-12 row ${$q.screen.lt.md ? 'justify-center' : 'justify-start'}  q-my-sm q-px-sm`"
        >
          <q-btn
            :class="`card_details_image ${isCardOnCart() || isAcquiredCard() ? 'bg-grey-6 no-pointer-events' : 'bg-primary'}`"
            color="primary"
            :icon="isCardOnCart() || isAcquiredCard() ? undefined : 'fa-solid fa-cart-shopping'"
            :label="
              isAcquiredCard()
                ? t('home.cards.button.owns')
                : isCardOnCart()
                  ? t('home.cards.button.cart')
                  : t('home.cards.button.trade')
            "
            :key="keyDetailsTradeButton"
            @click="isCardOnCart() || isAcquiredCard() ? null : addCard()"
          />
        </div>
      </div>

      <div
        class="col-12 col-md-6 column q-px-sm"
        :style="$q.screen.lt.md ? '' : 'min-height: 364px'"
      >
        <span class="col-auto row ytm-font-lg card_details_name q-mb-sm text-left">
          <div class="col-12 col-md-10 q-mb-sm">
            {{ card.name }}
          </div>
        </span>

        <div class="col bg-grey-4 ytm-rounded-sm q-pa-xs">
          <span class="q-my-sm ytm-font-sm">
            <b>{{ t('components.card.description') }}</b>
          </span>
          <p class="self-stretch card_details_description ytm-font-sm">{{ card.description }}</p>
        </div>
      </div>
    </div>

    <div class="card_details_close_btn">
      <q-btn
        class="col-2"
        :color="$q.screen.lt.sm ? 'white' : 'secondary'"
        text-color="secondary"
        :flat="$q.screen.lt.sm ? false : true"
        round
        size="0.7rem"
        icon="fa-solid fa-xmark"
        @click="$emit('close')"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.card_details {
  &_body {
    min-height: 300px;
    height: auto;
    width: 560px;
    border-radius: 20px;
    background-color: $grey-1;
    position: relative;
  }
  &_name {
    line-height: 1.5rem;
    font-weight: bold;
  }
  &_description {
    white-space: pre-wrap;
  }
  &_image {
    height: auto;
    width: 250px;
  }
  &_close_btn {
    position: absolute;
    top: 13px;
    right: 25px;
  }
}
</style>
