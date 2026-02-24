<script setup lang="ts">
import type { ICard } from 'src/interfaces';
interface props {
  card: ICard;
}

const props = withDefaults(defineProps<props>(), {
  card: () => {
    return {} as ICard;
  },
});
</script>
<template>
  <div class="card_details_body q-pa-md">
    <div class="row justify-between items-start">
      <div class="col-12 col-md-6">
        <q-img :src="card.imageUrl" class="card_details_image" />
      </div>

      <div class="col-12 col-md-6 row items-start">
        <h3 class="col card_details_name q-my-sm">{{ card.name }}</h3>
        <p class="col-8 bg-grey-4 q-pa-xs" style="overflow-y: auto">{{ card.description }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.card_details {
  &_body {
    min-height: 300px;
    border-radius: 20px;
    background-color: $grey-1;
    position: relative;
  }
  &_name {
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: bold;
  }
  &_image {
    height: auto;
    width: 250px;
  }
}
</style>
