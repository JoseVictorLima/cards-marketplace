import { defineStore } from 'pinia';
import { ref } from 'vue';

export const layoutStore = defineStore('layout', () => {
  const isLoginTriggered = ref(false);

  //Used to call login on MainLayout
  function triggerLogin() {
    isLoginTriggered.value = !isLoginTriggered.value;
  }

  return { isLoginTriggered, triggerLogin };
});
