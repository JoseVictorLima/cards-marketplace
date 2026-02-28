<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { ICard, IService, IUtils } from 'src/interfaces';
import cardView from 'src/components/card/CardView.vue';

const $services = inject('$services') as IService;
const $utils = inject('$utils') as IUtils;
const sessionUserCards = ref([] as ICard[]);
const cardsToAdd = ref([] as string[]);
const avaliableCards = ref([] as ICard[]);
const cardFilter = ref({
  rpp: 60,
  page: 1,
});
const isProfileAddCardLoading = ref(true);

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

async function getAvaliableCards(index: number, done: (last: boolean) => unknown) {
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
      message: 'Não foi possivel carregar mais cartas',
      position: 'bottom',
    });
    done(true);
  }
}

function selectCard(cardId: string) {
  cardsToAdd.value.push(cardId);
}

function removeSelectedCard(cardId: string) {
  const index = cardsToAdd.value.findIndex((obj) => obj === cardId);
  if (index != -1) {
    cardsToAdd.value.splice(index, 1);
  }
}

function isCardSelected(cardId: string) {
  if (cardsToAdd.value.length > 0) return cardsToAdd.value.some((obj) => obj === cardId);
}

onMounted(async () => {
  isProfileAddCardLoading.value = true;
  await getSessionUserCards();
  await getAvaliableCards(1, () => null);
  isProfileAddCardLoading.value = false;
});
</script>
<template>
  <div class="column bg-grey-3 q-pa-md profile_add_card_body">
    <q-form class="col-grow column">
      <div class="row justify-between items-center q-my-md q-px-md">
        <div class="row justify-start">
          <div class="col-12 text-h5 text-primary">Adicionar carta</div>
          <span class=""> Selecione as cartas que deseja adicionar à sua conta</span>
        </div>
      </div>

      <div class="col column q-pa-sm">
        <div
          class="col-grow ytm-rounded-sm profile_add_card_card_display q-pa-sm relative-position"
        >
          <!-- Loading -->
          <div
            v-if="isProfileAddCardLoading"
            class="absolute-full q-pa-sm column items-center justify-center"
          >
            <q-spinner color="primary" size="50px" />
          </div>
          <!-- Loading -->

          <div v-else>
            <div
              v-if="avaliableCards.length === 0"
              class="absolute-full q-pa-sm column items-center justify-center"
            >
              <div class="text-center q-py-md text-grey-7">
                <h3 class="q-mb-sm" style="font-size: 1.5rem">Nenhuma carta encontrada</h3>
                <q-icon name="fa-regular fa-face-frown" size="md" />
              </div>
            </div>

            <q-scroll-area v-else class="absolute-full q-pa-sm">
              <q-infinite-scroll :initial-index="1" @load="getAvaliableCards">
                <div class="row">
                  <div v-for="card in avaliableCards" :key="card.id">
                    <div
                      :class="`q-px-sm cursor-pointer profile_add_card_card_border ${isCardSelected(card.id) ? 'profile_add_card_card_selected profile_add_card_card_border_selected' : ''}`"
                      @click="
                        isCardSelected(card.id) ? removeSelectedCard(card.id) : selectCard(card.id)
                      "
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
      </div>
    </q-form>
  </div>
</template>
<style scoped lang="scss">
.profile_add_card {
  &_body {
    min-height: 94vh;
  }
  &_card_display {
    border-color: $grey-5;
    border-style: solid;
    border-width: 2px;
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
