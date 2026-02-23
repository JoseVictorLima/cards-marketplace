<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import type { ICard, IService } from 'src/interfaces';
const $services = inject('$services') as IService;

const cardFilter = ref({
  rpp: 10,
  page: 1,
});

const cards = ref<ICard[]>([]);

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
  <div>Ola Mundo!</div>
</template>
