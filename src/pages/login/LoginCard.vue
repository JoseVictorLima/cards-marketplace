<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import type { IService, IUtils } from 'src/interfaces';

const $emit = defineEmits<(e: 'close') => void>();
const { t } = useI18n();
const $services = inject('$services') as IService;
const $utils = inject('$utils') as IUtils;
const loginForm = ref({
  email: '',
  password: '',
});

// Show or hide password
const isPwd = ref(true);
const isLoadingLogin = ref(false);

async function login() {
  try {
    isLoadingLogin.value = true;
    const resp = await $services.authentication.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });
    // Checks if api returns error messages
    if (resp != null && typeof resp === 'object' && 'message' in resp) {
      throw resp.message;
    } else {
      $services.authentication.setToken(resp.token);
    }
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.login_generic'),
      position: 'bottom',
    });
  } finally {
    isLoadingLogin.value = false;
  }
}
</script>
<template>
  <div class="bg-white q-pa-md login_card_body">
    <q-form class="q-gutter-y-lg" greedy @submit="login">
      <div class="justify-between items-center row">
        <div class="text-h6 text-primary">Login</div>
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
        <q-input
          :disable="isLoadingLogin"
          outlined
          :label="t('login.labels.email')"
          v-model="loginForm.email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0 ? true : t('login.rules.email'))]"
        />
        <q-input
          :disable="isLoadingLogin"
          outlined
          :label="t('login.labels.password')"
          :type="isPwd ? 'password' : 'text'"
          v-model="loginForm.password"
          lazy-rules
          :rules="[(val) => (val && val.length > 0 ? true : t('login.rules.password'))]"
        >
          <template v-slot:append>
            <q-icon
              class="cursor-pointer text-primary"
              :name="isPwd ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
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
        />
      </div>
    </q-form>
  </div>
</template>
<style scoped lang="scss">
.login_card {
  &_body {
    min-width: 400px;
    border-radius: 10px;
  }
}
</style>
