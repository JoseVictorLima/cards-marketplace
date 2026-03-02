<script setup lang="ts">
import { ref } from 'vue';
import type { ICard } from 'src/interfaces';
import cardDetails from './CardDetails.vue';

interface props {
  card: ICard;
  size?: 'sm' | 'md';
  noDetails?: boolean;
  imageOnly?: boolean;
}

const props = withDefaults(defineProps<props>(), {
  card: () => {
    return {} as ICard;
  },
  size: 'md',
  noDetails: false,
  imageOnly: false,
});

const card = ref(props.card);
const isCardDetailsOpen = ref(false);
</script>
<template>
  <div :class="`card_body_${size} row justify-center items-start q-pa-sm`" aria-hidden="true">
    <q-img
      :src="card.imageUrl"
      :class="`col-12 card_image_${size} ${noDetails ? 'no-pointer-events' : 'cursor-pointer'}`"
      @click="isCardDetailsOpen = true"
    />
    <h3 v-if="!imageOnly" :class="`col-12 ytm-font-${size} q-my-none row justify-start`">
      <span class="ellipsis">
        {{ card.name }}
        <q-tooltip>
          <template v-slot:default>
            <span class="ytm-font-sm">
              {{ card.name }}
            </span>
          </template>
        </q-tooltip>
      </span>
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
    &_sm {
      @extend .card_body;
      max-width: 120px;
      min-height: 160px;
    }
    &_md {
      @extend .card_body;
      max-width: 180px;
      min-height: 220px;
    }
  }
  // &-border {
  //   border-width: 2px;
  //   border-style: solid;
  //   border-color: rgba(79, 245, 79, 0);
  // }
  // &_border:hover {
  //   border-color: $primary;
  // }
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
