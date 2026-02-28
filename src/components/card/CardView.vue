<script setup lang="ts">
import { ref } from 'vue';
import type { ICard } from 'src/interfaces';
import cardDetails from './CardDetails.vue';

interface props {
  card: ICard;
  size?: 'sm' | 'md';
}

const props = withDefaults(defineProps<props>(), {
  card: () => {
    return {} as ICard;
  },
  size: 'md',
});

const card = ref(props.card);
const isCardDetailsOpen = ref(false);
</script>
<template>
  <div :class="`card_body_${size} row justify-center items-start q-pa-sm`" aria-hidden="true">
    <q-img
      :src="card.imageUrl"
      :class="`card_image_${size} cursor-pointer`"
      @click="isCardDetailsOpen = true"
    />
    <h3 :class="`col-12 card_name_${size} q-my-none q-px-sm ellipsis text-left`">
      {{ card.name }}
      <q-tooltip>
        <template v-slot:default>
          <span class="card_tooltip">
            {{ card.name }}
          </span>
        </template>
      </q-tooltip>
    </h3>
  </div>

  <q-dialog v-model="isCardDetailsOpen" persistent>
    <cardDetails :card="card" @close="isCardDetailsOpen = false" />
  </q-dialog>
</template>
<style scoped lang="scss">
.card {
  &_body {
    position: relative;
    max-width: 220px;
    min-height: 220px;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(79, 245, 79, 0);
    &_sm {
      @extend .card_body;
      max-width: 160px;
      min-height: 160px;
    }
    &_md {
      @extend .card_body;
      max-width: 220px;
      min-height: 220px;
    }
  }
  &_body:hover {
    border-color: $primary;
  }
  &_image {
    height: auto;
    &_sm {
      @extend .card_image;
      width: 120px;
    }
    &_md {
      @extend .card_image;
      width: 180px;
    }
  }
  &_name {
    font-weight: bold;
    &_sm {
      @extend .card_name;
      font-size: 1.1rem;
    }
    &_md {
      @extend .card_name;
      font-size: 1.4rem;
    }
  }
  &_tooltip {
    font-size: 0.7rem !important;
  }
}
</style>
