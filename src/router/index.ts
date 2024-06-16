import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/App.vue"),
  },
  {
    path: "/ranking",
    name: "Ranking",
    component: () => import("@/pages/Ranking.vue"),
  },
  {
    path: "/play",
    name: "Play",
    component: () => import("@/pages/PlayScreen.vue"),
  },
  {
    path: "/result",
    name: "Result",
    component: () => import("@/pages/Result.vue"),
  },
  // {
  //   path: '/rooms/:id',
  //   name: 'IndividualRoom',
  //   component: () => import('@/pages/IndividualRoom.vue'),
  // },
  // {
  //   path: '/rooms/create',
  //   name: 'CreateRoom',
  //   component: () => import('@/pages/CreateRoom.vue'),
  // },
  {
    // 404 page
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  }
]

const router = createRouter({
  history: createWebHistory('/game/'),
  routes,
});

export default router;
