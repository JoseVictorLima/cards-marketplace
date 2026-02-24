<script setup lang="ts">
import { ref } from 'vue';
import type { ICard } from 'src/interfaces';
import cardDetails from './CardDetails.vue';

interface props {
  card: ICard;
}

const props = withDefaults(defineProps<props>(), {
  card: () => {
    return {} as ICard;
  },
});

const card = ref(props.card);
const isCardDetailsOpen = ref(false);
</script>
<template>
  <div class="card_body row justify-center items-start q-pa-sm">
    <q-img
      :src="card.imageUrl"
      class="card_image cursor-pointer"
      @click="isCardDetailsOpen = true"
    />
    <h3 class="col-12 card_name q-my-none q-px-sm ellipsis text-left">
      {{ card.name }}
      <q-tooltip>{{ card.name }}</q-tooltip>
    </h3>
  </div>

  <q-dialog v-model="isCardDetailsOpen">
    <cardDetails :card="card" />
  </q-dialog>
</template>
<style scoped lang="scss">
.card {
  &_body {
    position: relative;
    max-width: 220px;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(79, 245, 79, 0);
  }
  &_body:hover {
    border-color: $primary;
  }
  &_image {
    height: auto;
    width: 200px;
  }
  &_name {
    font-size: 1.4rem;
    font-weight: bold;
  }
}
</style>
