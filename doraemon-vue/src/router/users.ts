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
    path: "/userInfo",
    component: defineAsyncComponent(
      () => import("@/components/user/userInfo.vue")
    ),
  },
  {
    path: "/myBlogs",
    component: defineAsyncComponent(() => import("@/components/user/blog.vue")),
  },
  {
    path: "/feedback",
    component: defineAsyncComponent(
      () => import("@/components/user/feedback.vue")
    ),
  },
];

export default usersRoutes;
