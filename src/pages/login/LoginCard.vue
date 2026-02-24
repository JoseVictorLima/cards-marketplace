<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const $emit = defineEmits<(e: 'close') => void>();
const { t } = useI18n();

const loginForm = reactive({
  username: '',
  password: '',
});
</script>
<template>
  <q-card class="bg-white q-pa-sm" style="min-width: 400px; border-radius: 10px">
    <q-card-section class="justify-between items-center row">
      <div class="text-h6">Login</div>
      <q-btn flat round dense icon="close" aria-label="Close" @click="$emit('close')" />
    </q-card-section>

    <q-card-section>
      <q-input filled :label="t('login.labels.username')" v-model="loginForm.username" />
      <q-input
        filled
        :label="t('login.labels.password')"
        type="password"
        v-model="loginForm.password"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn color="primary" :label="t('login.labels.submit')" />
    </q-card-actions>
  </q-card>
</template>
