import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

  {
    path: '/profile/:name',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/profile/ProfilePage.vue') },
      { path: 'add-card', component: () => import('pages/profile/ProfileAddCard.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
