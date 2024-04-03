import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";

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
    path: "/news",
    component: defineAsyncComponent(() => import("@/components/news.vue")),
  },
  {
    path: "/newsPage/:id",
    name: "newsPage",
    component: defineAsyncComponent(() => import("@/components/newsPage.vue")),
    props: true,
  },
  {
    path: "/adminLogin",
    component: defineAsyncComponent(
      () => import("@/components/admin/login.vue")
    ),
  },
  {
    path: "/admin",
    component: defineAsyncComponent(() => import("@/views/admin.vue")),
    children: [
      {
        path: "",
        component: defineAsyncComponent(
          () => import("@/components/admin/index.vue")
        ),
      },
      {
        path: "users",
        component: defineAsyncComponent(
          () => import("@/components/admin/users.vue")
        ),
      },
      {
        path: "addNews",
        component: defineAsyncComponent(
          () => import("@/components/admin/addNews.vue")
        ),
      },
      {
        path: "news",
        component: defineAsyncComponent(
          () => import("@/components/admin/news.vue")
        ),
      },
    ],
  },
  {
    path: "/login",
    component: defineAsyncComponent(
      () => import("@/components/user/login.vue")
    ),
  },
  {
    path: "/regist",
    component: defineAsyncComponent(
      () => import("@/components/user/regist.vue")
    ),
  },
  {
    path: "/userInfo",
    component: defineAsyncComponent(
      () => import("@/components/user/userInfo.vue")
    ),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
