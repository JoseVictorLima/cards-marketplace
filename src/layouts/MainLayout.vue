<script setup lang="ts">
import { ref } from 'vue';
import loginCard from 'src/pages/login/LoginCard.vue';

const isLoginCardOpen = ref(false);
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-secondary text-white q-px-md">
        <q-toolbar-title class="text-primary text-bold">
          <span>
            YTM
            <q-tooltip>Yu-gi-oh Trade Marketplace</q-tooltip>
          </span>
        </q-toolbar-title>
        <q-btn
          class="bg-primary text-white"
          rounded
          label="login"
          @click="isLoginCardOpen = true"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="isLoginCardOpen" persistent>
      <loginCard @close="isLoginCardOpen = false" />
    </q-dialog>
  </q-layout>
</template>
