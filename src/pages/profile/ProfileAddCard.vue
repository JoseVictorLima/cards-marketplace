<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { ICard, IService, IUtils } from 'src/interfaces';
import cardView from 'src/components/card/CardView.vue';
import { useRouter } from 'vue-router';
import { userStore } from 'src/stores/user-store';
import { useI18n } from 'vue-i18n';

const $services = inject('$services') as IService;
const $utils = inject('$utils') as IUtils;
const $router = useRouter();
const $store = {
  useUser: userStore(),
};
const { t } = useI18n();
const sessionUserCards = ref([] as ICard[]);
const selectedCards = ref([] as ICard[]);
const avaliableCards = ref([] as ICard[]);
const cardFilter = ref({
  rpp: 60,
  page: 1,
});
const isAddCardLoading = ref(true);
const isConfirmSelectedCardOpen = ref(false);

async function getSessionUserCards() {
  try {
    const resp = await $services.me.getSessionUserCards();
    if (resp && resp.length > 0) {
      sessionUserCards.value = resp;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAvailableCards(index: number, done: (last: boolean) => unknown) {
  try {
    cardFilter.value.page = index;
    const resp = await $services.card.getCards(cardFilter.value);
    if (resp && resp.list) {
      avaliableCards.value = [
        ...avaliableCards.value,
        ...resp.list.filter((card) => {
          return !sessionUserCards.value.some((sessionCard) => sessionCard.id === card.id);
        }),
      ];
      done(!resp.more);
    } else {
      done(true);
    }
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.get_available_cards'),
      position: 'bottom',
    });
    done(true);
  }
}

function selectCard(card: ICard) {
  selectedCards.value.push(card);
}

function removeSelectedCard(cardId: string) {
  const index = selectedCards.value.findIndex((item) => item.id === cardId);
  if (index != -1) {
    selectedCards.value.splice(index, 1);
  }
  if (isConfirmSelectedCardOpen.value === true && selectedCards.value.length === 0) {
    isConfirmSelectedCardOpen.value = false;
  }
}

async function saveSelectedCards() {
  try {
    isAddCardLoading.value = true;

    const cardsToSave = selectedCards.value.map((item) => item.id);
    const resp = await $services.me.addCards(cardsToSave);
    if (resp != undefined && typeof resp === 'object') {
      throw new Error(resp);
    }
    $utils.notify.positive({
      message: t('success.add_card'),
      position: 'bottom',
    });
    const sessionUser = $store.useUser.getSessionUser.name;
    await $router.push({
      path: `/profile/${sessionUser}`,
    });
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.add_card'),
      position: 'bottom',
    });
    isAddCardLoading.value = false;
  }
}

function isCardSelected(cardId: string) {
  if (selectedCards.value.length > 0) return selectedCards.value.some((item) => item.id === cardId);
}

onMounted(async () => {
  isAddCardLoading.value = true;
  await getSessionUserCards();
  await getAvailableCards(1, () => null);
  isAddCardLoading.value = false;
});
</script>
<template enter-class="bg-grey-3">
  <div class="column q-pa-md profile_add_card_body">
    <div
      :class="` ${$q.screen.lt.sm ? 'column' : 'row justify-between'} items-center q-mb-md q-px-md`"
    >
      <div
        :class="`column ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} q-mb-sm q-mr-md`"
      >
        <span :class="`ytm-font-lg text-primary ${$q.screen.lt.sm ? 'text-center' : 'text-left'}`"
          ><b> {{ t('profile.add_cards.title') }} </b></span
        >
        <span class="ytm-font-sm"> {{ t('profile.add_cards.info') }} </span>
      </div>
      <q-btn
        :disable="selectedCards.length === 0"
        color="primary"
        :round="$q.screen.gt.sm ? false : true"
        :rounded="$q.screen.gt.sm ? true : false"
        icon="fa-solid fa-plus"
        :label="$q.screen.gt.sm ? t('profile.add_cards.add') : ''"
        @click="isConfirmSelectedCardOpen = true"
      >
        <q-badge v-if="selectedCards.length > 0" color="red" floating>
          {{ selectedCards.length }}
        </q-badge>
      </q-btn>
    </div>

    <div class="col-grow ytm-rounded-sm profile_add_card_card_display q-pa-sm relative-position">
      <!-- Loading -->
      <div v-if="isAddCardLoading" class="absolute-full q-pa-sm column items-center justify-center">
        <q-spinner color="primary" size="50px" />
      </div>
      <!-- Loading -->

      <div v-else>
        <div
          v-if="avaliableCards.length === 0"
          class="absolute-full q-pa-sm column items-center justify-center"
        >
          <div class="text-center q-py-md text-grey-7">
            <h3 class="q-mb-sm ytm-font-md">{{ t('profile.add_cards.no_cards') }}</h3>
            <q-icon name="fa-regular fa-face-frown" size="md" />
          </div>
        </div>

        <q-scroll-area v-else class="absolute-full q-pa-sm">
          <q-infinite-scroll :initial-index="1" @load="getAvailableCards">
            <div class="row">
              <div v-for="card in avaliableCards" :key="card.id">
                <div
                  :class="`q-px-sm cursor-pointer profile_add_card_card_border ${isCardSelected(card.id) ? 'profile_add_card_card_selected profile_add_card_card_border_selected' : ''}`"
                  @click="isCardSelected(card.id) ? removeSelectedCard(card.id) : selectCard(card)"
                >
                  <card-view :card="card" size="md" no-details />
                </div>
              </div>
            </div>

            <template v-slot:loading>
              <div class="row justify-center q-mt-sm">
                <q-spinner-dots color="primary" size="30px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-scroll-area>
      </div>
    </div>

    <!-- Comfirm selected cards -->
    <q-dialog
      v-model="isConfirmSelectedCardOpen"
      persistent
      maximized
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card class="bg-grey-3 q-pa-lg">
        <q-form class="q-gutter-md" @submit="saveSelectedCards">
          <div class="row items-center">
            <div
              :class="`col-12 row ${$q.screen.lt.sm ? 'justify-center q-gutter-sm' : 'justify-between'} q-mb-md`"
            >
              <span class="text-primary ytm-font-lg">
                <b> {{ t('profile.add_cards.confirm.title') }} </b>
              </span>

              <q-btn
                :disable="isAddCardLoading"
                color="secondary"
                flat
                round
                size="0.7rem"
                icon="fa-solid fa-xmark"
                @click="isConfirmSelectedCardOpen = false"
              />
            </div>

            <div
              class="col-12 row relative-position profile_add_card_card_display"
              style="height: 80vh"
            >
              <q-scroll-area class="absolute-full q-pa-sm">
                <q-list separator class="row">
                  <q-item
                    v-for="card in selectedCards"
                    :key="`selected_${card.id}`"
                    class="row col-12"
                  >
                    <div class="col-12 row justify-around items-center q-gutter-x-sm">
                      <div
                        :class="`col-10 row ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} items-start`"
                      >
                        <card-view :card="card" size="sm" no-details image-only />

                        <div
                          :class="`${$q.screen.lt.sm ? 'col-12' : 'col-8'} column items-start q-py-sm full-height`"
                        >
                          <span class="q-mb-sm ytm-font-sm">
                            <b>{{ card.name }}</b>
                          </span>

                          <div>
                            <span class="ytm-font-sm">
                              {{ t('profile.add_cards.confirm.description') }}
                            </span>
                            <p class="ytm-font-sm" style="white-space: pre-wrap">
                              {{ card.description }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <q-btn
                        :disable="isAddCardLoading"
                        flat
                        round
                        size="md"
                        color="secondary"
                        icon="fa-solid fa-trash-can"
                        @click="removeSelectedCard(card.id)"
                      >
                        <q-tooltip>
                          <template v-slot:default>
                            <span class="ytm-font-sm">
                              {{ t('profile.add_cards.confirm.remove') }}
                            </span>
                          </template>
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </div>
          </div>
          <q-card-actions class="col-12 self-end" align="right">
            <q-btn
              :disable="isAddCardLoading"
              :loading="isAddCardLoading"
              type="submit"
              color="primary"
              rounded
              :label="t('profile.add_cards.confirm.save')"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- Comfirm selected cards -->
  </div>
</template>
<style scoped lang="scss">
.profile_add_card {
  &_body {
    min-height: 89vh;
  }
  &_card_display {
    border-color: $grey-5;
    border-style: solid;
    border-width: 2px;
    background-color: $grey-4;
  }
  &_card {
    &_border {
      border-width: 3px;
      border-style: solid;
      border-color: rgba(79, 245, 79, 0);
      &:hover {
        border-color: $grey-6;
      }
      &_selected:hover {
        border-color: $primary;
      }
    }
    &_selected {
      background-color: $green-12;
    }
  }
}
</style>
