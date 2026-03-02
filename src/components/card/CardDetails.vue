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
      <div class="col-12 col-md-6 row justify-center q-mb-sm">
        <q-img :src="card.imageUrl" class="card_details_image" />
      </div>

      <div class="col-12 col-md-6 row items-start q-px-sm">
        <span class="col-12 col-md-10 ytm-font-lg card_details_name q-mb-sm text-left">
          {{ card.name }}
        </span>

        <div class="">
          <span class="q-my-sm ytm-font-sm">
            <b>{{ t('components.card.description') }}</b>
          </span>
          <p class="card_details_description ytm-font-sm">{{ card.description }}</p>
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
    line-height: 1.5rem;
    font-weight: bold;
  }
  &_description {
    white-space: pre-wrap;
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
