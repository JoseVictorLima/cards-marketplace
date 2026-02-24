<script setup lang="ts">
import type { ICard } from 'src/interfaces';
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
const { t } = useI18n();
</script>
<template>
  <div class="card_details_body q-pa-md">
    <div class="row justify-between items-start">
      <div class="col-12 col-md-6 row justify-center">
        <q-img :src="card.imageUrl" class="card_details_image" />
      </div>

      <div class="col-12 col-md-6 row items-start content-stretch">
        <h3 class="col-12 col-md-10 card_details_name q-my-sm text-left">{{ card.name }}</h3>

        <div class="col-grow">
          <span class="q-my-sm">
            {{ t('components.card.description') }}
          </span>
          <p class="bg-grey-4 q-pa-xs">{{ card.description }}</p>
        </div>
      </div>
    </div>
    <div class="card_details_close_btn">
      <q-btn
        class="col-2"
        color="secondary"
        flat
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
  &_close_btn {
    position: absolute;
    top: 18px;
    right: 15px;
  }
}
</style>
