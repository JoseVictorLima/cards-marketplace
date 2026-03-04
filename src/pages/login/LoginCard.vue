<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { IService, IUtils } from 'src/interfaces';
import { useRouter } from 'vue-router';

interface IRetrieveLogin {
  email: string;
  password: string;
}

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
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isLoadingLogin = ref(false);
const recoveredLogins = ref([] as IRetrieveLogin[]);
const isForgotPasswordOpen = ref(false);
const isRecovered = ref(false);
const forgotEmail = ref('');
const recoveredPassword = ref('');

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
    if (typeof error === 'string' && error === 'Incorrect password/email') {
      $utils.notify.negative({
        message: t('errors.login_password'),
        position: 'bottom',
      });
    } else {
      $utils.notify.negative({
        message: t('errors.login_generic'),
        position: 'bottom',
      });
    }
  }
  isLoadingLogin.value = false;
}

function closeRecoverPassword() {
  isForgotPasswordOpen.value = false;
  isRecovered.value = false;
  forgotEmail.value = '';
  recoveredPassword.value = '';
}

function recoverPassword() {
  const index = recoveredLogins.value.findIndex((item) => item.email === forgotEmail.value);
  if (index != -1 && recoveredLogins.value[index]) {
    isRecovered.value = true;
    recoveredPassword.value = recoveredLogins.value[index].password;
  } else {
    $utils.notify.negative({
      message: t('errors.recover_password'),
      position: 'bottom',
    });
  }
}

onMounted(() => {
  const storedLogin = localStorage.getItem('recoveredLogins');
  if (storedLogin) {
    const logins = JSON.parse(storedLogin);
    recoveredLogins.value = logins as IRetrieveLogin[];
  }
});
</script>
<template>
  <div class="bg-white q-pa-md login_card_body ytm-rounded-md">
    <q-form class="q-gutter-y-lg" greedy @submit="login">
      <div class="justify-between items-center row">
        <div class="ytm-font-lg text-primary">
          <b>{{ t('login.labels.login') }}</b>
        </div>
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
          :rules="[
            (val: string) => (val && val.length > 0 ? true : t('login.rules.email')),
            (val: string) =>
              val && emailRegex.test(val) ? true : t('register.rules.email_invalid'),
          ]"
        />

        <ytm-input
          :disable="isLoadingLogin"
          :label="t('login.labels.password')"
          type="password"
          v-model="loginForm.password"
          lazy-rules
          :rules="[(val: string) => (val && val.length > 0 ? true : t('login.rules.password'))]"
        />

        <div class="row justify-end q-mt-sm">
          <span
            class="ytm-font-sm cursor-pointer"
            style="text-decoration: underline"
            @click="isForgotPasswordOpen = true"
          >
            {{ t('login.labels.recover_password') }}
          </span>
        </div>
      </div>

      <div class="row justify-around items-center">
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
          class=""
          rounded
          color="secondary"
          :label="t('login.labels.register')"
          @click="$emit('open-register')"
        />
      </div>
    </q-form>

    <q-dialog v-model="isForgotPasswordOpen" persistent>
      <q-card class="ytm-rounded-md login_card_body">
        <q-card-section class="row items-center">
          <span class="ytm-font-lg text-primary">
            <b> {{ t('login.recover_password.title') }} </b>
          </span>
        </q-card-section>
        <q-card-section class="row items-center q-py-sm">
          <p class="q-mb-sm">
            {{ t('login.recover_password.description') }}
          </p>
          <p style="font-size: 0.8rem; white-space: pre-line">
            {{ t('login.recover_password.info') }}
          </p>
        </q-card-section>
        <q-card-section class="q-py-sm">
          <ytm-input
            :disable="isRecovered"
            v-model="forgotEmail"
            :label="t('login.labels.email')"
            lazy-rules
            :rules="[
              (val: string) => (val && val.length > 0 ? true : t('login.rules.email')),
              (val: string) =>
                val && emailRegex.test(val) ? true : t('register.rules.email_invalid'),
            ]"
          ></ytm-input>
          <span v-if="recoveredPassword != ''">
            <b>{{ t('login.recover_password.password') }}</b> {{ recoveredPassword }}
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            rounded
            flat
            :label="t('login.recover_password.cancel')"
            color="primary"
            @click="closeRecoverPassword()"
          />
          <q-btn
            :disable="isRecovered"
            rounded
            flat
            :label="t('login.recover_password.recover')"
            color="primary"
            @click="recoverPassword()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style scoped lang="scss">
.login_card {
  &_body {
    min-width: 350px;
  }
}
</style>
