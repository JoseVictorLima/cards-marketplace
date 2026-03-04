<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import type { IService, IUtils } from 'src/interfaces';
import { useI18n } from 'vue-i18n';

interface IRetrieveLogin {
  email: string;
  password: string;
}

const $emit = defineEmits<{
  (e: 'close'): void;
  (e: 'login'): void;
}>();
const $services = inject('$services') as IService;
const $utils = inject('$utils') as IUtils;
const { t } = useI18n();

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});
const isRegisterLoading = ref(false);
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = {
  digit: /\d/,
  lowerCase: /[a-z]/,
  upperCase: /[A-Z]/,
  specialCharacter: /[!@#$%*?&]/,
  length: /^.{8,}$/,
};
const passwordErrorMessage = ref('');
const recoveredLogins = ref([] as IRetrieveLogin[]);

// Checks if password matches the regex and sets the error message to show on input
function passwordValidator(inputValue: string): boolean {
  if (!passwordRegex.digit.test(inputValue)) {
    passwordErrorMessage.value = t('register.rules.password_digit');
    return false;
  }
  if (!passwordRegex.lowerCase.test(inputValue)) {
    passwordErrorMessage.value = t('register.rules.password_lowerCase');
    return false;
  }
  if (!passwordRegex.upperCase.test(inputValue)) {
    passwordErrorMessage.value = t('register.rules.password_upperCase');
    return false;
  }
  if (!passwordRegex.specialCharacter.test(inputValue)) {
    passwordErrorMessage.value = t('register.rules.password_special_character');
    return false;
  }
  if (!passwordRegex.length.test(inputValue)) {
    passwordErrorMessage.value = t('register.rules.password_length');
    return false;
  }
  passwordErrorMessage.value = '';
  return true;
}

async function register() {
  try {
    isRegisterLoading.value = true;
    const newUser = {
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
    };
    const resp = await $services.authentication.register(newUser);
    // Checks if api returns error messages or resp is null.
    if (resp === null || (resp != null && typeof resp === 'object' && 'message' in resp)) {
      throw resp.message;
    } else if (resp.userId && resp.userId != '') {
      $utils.notify.positive({
        message: t('success.register'),
        position: 'bottom',
      });
      saveRecoverLogin(newUser.email, newUser.password);
      $emit('login');
      $emit('close');
    }
  } catch (error) {
    console.log(error);
    $utils.notify.negative({
      message: t('errors.register_generic'),
      position: 'bottom',
      timeout: 3500,
    });
  }
  isRegisterLoading.value = false;
}

// Save the last 20 logins of created accounts for recovery in case the user forgets their password
function saveRecoverLogin(email: string, password: string) {
  if (recoveredLogins.value.length >= 20) {
    recoveredLogins.value.splice(0, 1);
    recoveredLogins.value.push({ email, password });
  } else {
    recoveredLogins.value.push({ email, password });
  }
  localStorage.setItem('recoveredLogins', JSON.stringify(recoveredLogins.value));
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
  <div class="bg-white q-pa-md ytm-rounded-md register_card_body">
    <q-form class="q-gutter-y-lg" @submit="register" greedy>
      <div class="justify-between items-center row">
        <div class="ytm-font-lg text-primary">
          <b>{{ t('register.label.register') }}</b>
        </div>
        <q-btn
          :disable="isRegisterLoading"
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
          loading
          :disable="isRegisterLoading"
          v-model="registerForm.name"
          :label="t('register.label.name')"
          required
          lazy-rules
          maxlength="70"
          :rules="[(val: string) => (val && val.length > 0 ? true : t('register.rules.name'))]"
        />
        <ytm-input
          :disable="isRegisterLoading"
          v-model="registerForm.email"
          type="text"
          :label="t('register.label.email')"
          required
          lazy-rules
          maxlength="254"
          :rules="[
            (val: string) => (val && val.length > 0 ? true : t('register.rules.email')),
            (val: string) =>
              val && emailRegex.test(val) ? true : t('register.rules.email_invalid'),
          ]"
        />
        <ytm-input
          :disable="isRegisterLoading"
          v-model="registerForm.password"
          type="password"
          :label="t('register.label.password')"
          required
          lazy-rules
          maxlength="64"
          :hint="t('register.hint.password')"
          :rules="[
            (val: string) => (val && val.length > 0 ? true : t('register.rules.password')),
            (val: string) => (val && passwordValidator(val) ? true : passwordErrorMessage),
          ]"
        />
        <ytm-input
          :disable="isRegisterLoading"
          v-model="registerForm.confirmPassword"
          type="password"
          :label="t('register.label.confirm_password')"
          required
          lazy-rules
          :rules="[
            (val: string) => val === registerForm.password || t('register.rules.confirm_password'),
          ]"
        />
      </div>

      <div class="row justify-end">
        <q-btn
          :loading="isRegisterLoading"
          :disable="isRegisterLoading"
          class="col-4"
          type="submit"
          rounded
          color="primary"
          :label="t('register.label.submit')"
        />
      </div>
    </q-form>
  </div>
</template>
<style scoped lang="scss">
.register_card {
  &_body {
    width: 500px;
    min-width: 350px;
  }
}
</style>
