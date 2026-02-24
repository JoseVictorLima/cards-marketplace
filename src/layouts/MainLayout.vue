<script setup lang="ts"></script>
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
        <q-btn class="bg-primary text-white" rounded label="login" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
