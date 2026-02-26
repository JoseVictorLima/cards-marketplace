<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import type { IService, IUtils } from 'src/interfaces';
import { useRouter } from 'vue-router';

const $emit = defineEmits<{
  (e: 'close'): void;
  (e: 'open-register'): void;
}>();
const { t } = useI18n();
const $services = inject('$services') as IService;
const $utils = inject('$utils') as IUtils;
const $router = useRouter();
const loginForm = ref({
  email: '',
  password: '',
});

const isLoadingLogin = ref(false);

async function login() {
  try {
    isLoadingLogin.value = true;
    const resp = await $services.authentication.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });
    // Checks if api returns error messages or resp is null.
    if (resp === null || (resp != null && typeof resp === 'object' && 'message' in resp)) {
      throw resp.message;
    } else {
      // Set token on localstorage and Reload the page, allowing the layout to retrieve the logged-in user's data..
      $services.authentication.setAccessToken(resp.token);
      $router.go(0);
    }
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.login_generic'),
      position: 'bottom',
    });
  }
  isLoadingLogin.value = false;
}
</script>
<template>
  <div class="bg-white q-pa-md login_card_body ytm-rounded-md">
    <q-form class="q-gutter-y-lg" greedy @submit="login">
      <div class="justify-between items-center row">
        <div class="text-h6 text-primary">{{ t('login.labels.login') }}</div>
        <q-btn
          :disable="isLoadingLogin"
          color="secondary"
          flat
          round
          size="0.7rem"
          icon="fa-solid fa-xmark"
          @click="$emit('close')"
        />
      </div>

      <div class="q-gutter-y-md">
        <ytm-input
          :disable="isLoadingLogin"
          :label="t('login.labels.email')"
          v-model="loginForm.email"
          lazy-rules
          :rules="[(val: string) => (val && val.length > 0 ? true : t('login.rules.email'))]"
        />

        <ytm-input
          :disable="isLoadingLogin"
          :label="t('login.labels.password')"
          type="password"
          v-model="loginForm.password"
          lazy-rules
          :rules="[(val: string) => (val && val.length > 0 ? true : t('login.rules.password'))]"
        />
      </div>

      <div class="row justify-around">
        <q-btn
          :disable="isLoadingLogin"
          :loading="isLoadingLogin"
          type="submit"
          class="col-4"
          rounded
          color="primary"
          :label="t('login.labels.submit')"
        />
        <q-btn
          :disable="isLoadingLogin"
          class="col-4"
          rounded
          color="secondary"
          :label="'Criar conta'"
          @click="$emit('open-register')"
        />
      </div>
    </q-form>
  </div>
</template>
<style scoped lang="scss">
.login_card {
  &_body {
    min-width: 400px;
  }
}
</style>
