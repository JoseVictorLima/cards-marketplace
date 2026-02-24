<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import type { ICard, IService } from 'src/interfaces';
import cardComponent from 'src/components/card/CardView.vue';
const $services = inject('$services') as IService;

const cardFilter = ref({
  rpp: 20,
  page: 1,
});

const cards = ref<ICard[]>([] as ICard[]);

async function fetchCards() {
  try {
    await $services.card.getCards(cardFilter.value).then((result) => {
      cards.value = result.list;
    });
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await fetchCards();
});
</script>
<template>
  <div class="q-px-sm q-py-md homepage_body bg-grey-3">
    <div class="row items-start justtify-center q-col-gutter-x-md">
      <div class="col-12 justtify-center">
        <div v-if="cards.length > 0" class="row justify-start items-center">
          <card-component v-for="card in cards" :key="card.id" :card="card" class="q-mx-lg">
          </card-component>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.homepage {
  &_body {
    min-height: 100vh;
  }
}
</style>
