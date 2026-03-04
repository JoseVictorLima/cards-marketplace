import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/trades',
    children: [
      { path: 'cards', component: () => import('pages/home/CardPage.vue'), meta: { public: true } },
      {
        path: 'trades',
        component: () => import('pages/home/TradePage.vue'),
        meta: { public: true },
      },
    ],
  },

  {
    path: '/profile/:name',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/profile/ProfilePage.vue'),
        meta: { public: true },
      },
      {
        path: 'add-card',
        component: () => import('pages/profile/ProfileAddCard.vue'),
        meta: { public: false },
      },
    ],
  },

  {
    path: '/cart',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/cart/CartPage.vue'),
        meta: { public: true },
      },
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
