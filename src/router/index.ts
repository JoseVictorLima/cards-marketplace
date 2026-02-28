import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { inject } from 'vue';
import type { IService } from 'src/interfaces';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    const $services = inject('$services') as IService;
    const token = $services.authentication.getAccessToken();
    const isExpired = $services.authentication.isTokenExpired(token);
    const publicRoutes = ['/', '/profile:name'];
    if (isExpired) {
      $services.authentication.removeAccessToken();
      // If the user is not accessing a public route and is not logged in, they will be redirected to the HomePage.
      if (!publicRoutes.includes(to.path)) return { path: '/' };
    }
  });

  return Router;
});
