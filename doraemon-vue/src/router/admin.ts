import { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";

const adminRoutes: RouteRecordRaw[] = [
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
          () => import("@/components/admin/users/users.vue")
        ),
      },
      {
        path: "blog",
        children: [
          {
            path: "categories",
            component: defineAsyncComponent(
              () => import("@/components/admin/blog/categories.vue")
            ),
          },
          {
            path: "blogList",
            component: defineAsyncComponent(
              () => import("@/components/admin/blog/blogList.vue")
            ),
          },
        ],
      },
      {
        path: "news",
        children: [
          {
            path: "addNews",
            component: defineAsyncComponent(
              () => import("@/components/admin/news/addNews.vue")
            ),
          },
          {
            path: "newsList",
            component: defineAsyncComponent(
              () => import("@/components/admin/news/newsList.vue")
            ),
          },
        ],
      },
    ],
  },
];

export default adminRoutes;
