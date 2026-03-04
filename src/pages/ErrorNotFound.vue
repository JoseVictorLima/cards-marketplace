<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <div class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div class="row justify-center">
      <!-- <div style="font-size: 30vh">404</div> -->

      <div class="col-8 text-h2" style="opacity: 0.6">
        {{ t('not_found.info') }}
      </div>

      <div class="col-12 row justify-center">
        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="primary"
          unelevated
          rounded
          to="/"
          :label="t('not_found.button')"
          no-caps
        />
      </div>
    </div>
  </div>
</template>
