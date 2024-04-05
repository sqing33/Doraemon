import { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";

const usersRoutes: RouteRecordRaw[] = [
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

export default usersRoutes;
