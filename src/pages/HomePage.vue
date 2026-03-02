<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import type { ICard, IService, IUtils } from 'src/interfaces';
import { useI18n } from 'vue-i18n';
import cardView from 'src/components/card/CardView.vue';

const $services = inject('$services') as IService;
const $utils = inject('$utils') as IUtils;
const { t } = useI18n();
const cardFilter = ref({
  rpp: 20,
  page: 1,
});
const isCardLoading = ref(false);
const cards = ref<ICard[]>([] as ICard[]);

async function getCards() {
  try {
    isCardLoading.value = true;
    await $services.card.getCards(cardFilter.value).then((result) => {
      if (result && result.list) {
        cards.value = result.list;
      }
    });
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.get_cards'),
      position: 'bottom',
    });
  } finally {
    isCardLoading.value = false;
  }
}

onMounted(async () => {
  await getCards();
});
</script>
<template>
  <div class="q-px-sm q-py-md homepage_body bg-grey-3">
    <div class="col-12 col-md-11 justify-center">
      <!-- Loading -->
      <div v-if="isCardLoading" class="q-pa-md fullscreen flex flex-center">
        <q-spinner-dots color="primary" size="50px" />
      </div>
      <!-- Loading -->

      <div v-else>
        <div v-if="cards.length > 0" class="row justify-center q-px-md">
          <ul
            :class="`col-12 col-sm-11 row ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} items-center`"
            style="list-style: none; gap: 0.8rem; padding: 0; margin: 0"
          >
            <li
              :class="`${$q.screen.lt.sm ? 'col-12 row justify-center' : ''}`"
              v-for="card in cards"
              :key="card.id"
            >
              <card-view :card="card" />
            </li>
          </ul>
        </div>

        <div v-else class="fullscreen flex flex-center">
          <div class="text-center q-py-md text-grey-7">
            <h3 class="homepage_no_cards">{{ t('homepage.no_cards') }}</h3>
            <q-icon name="fa-regular fa-face-frown" size="xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.homepage {
  &_body {
    min-height: 94vh;
  }
  &_no_cards {
    font-size: 2rem;
  }
}
</style>
