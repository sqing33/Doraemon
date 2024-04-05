import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";
import adminRoutes from "./admin";
import usersRoutes from "./users";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: defineAsyncComponent(() => import("@/components/index.vue")),
  },
  {
    path: "/author",
    component: defineAsyncComponent(
      () => import("@/components/AuthorIntro.vue")
    ),
  },
  {
    path: "/character",
    component: defineAsyncComponent(
      () => import("@/components/CharactIntro.vue")
    ),
  },
  {
    path: "/blog",
    children: [
      {
        path: "",
        component: defineAsyncComponent(
          () => import("@/components/blog/index.vue")
        ),
      },
      {
        path: ":id",
        component: defineAsyncComponent(
          () => import("@/components/blog/blogPage.vue")
        ),
        props: true,
      },
    ],
  },
  {
    path: "/news",
    children: [
      {
        path: "",
        component: defineAsyncComponent(
          () => import("@/components/news/index.vue")
        ),
      },
      {
        path: ":id",
        component: defineAsyncComponent(
          () => import("@/components/news/newsPage.vue")
        ),
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

adminRoutes.forEach((route) => {
  router.addRoute(route);
});

usersRoutes.forEach((route) => {
  router.addRoute(route);
});

export default router;
