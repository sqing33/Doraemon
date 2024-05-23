import { RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";
import { ro } from "element-plus/es/locale/index.mjs";

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
          () => import("@/components/admin/users.vue")
        ),
        meta: {
          title: "用户管理",
        },
      },
      {
        path: "feedback",
        component: defineAsyncComponent(
          () => import("@/components/admin/feedback.vue")
        ),
      },
      {
        path: "blog",
        component: defineAsyncComponent(
          () => import("@/components/admin/blog/blogList.vue")
        ),
        meta: {
          title: "帖子管理",
        },
      },
      {
        path: "news",
        meta: {
          title: "新闻管理",
        },
        children: [
          {
            path: "addNews",
            component: defineAsyncComponent(
              () => import("@/components/admin/news/addNews.vue")
            ),
            meta: {
              title: "发布新闻",
            },
          },
          {
            path: "newsList",
            component: defineAsyncComponent(
              () => import("@/components/admin/news/newsList.vue")
            ),
            meta: {
              title: "新闻列表",
            },
          },
        ],
      },
      {
        path: "chart",
        meta: {
          title: "数据统计",
        },
        component: defineAsyncComponent(
          () => import("@/components/admin/chart.vue")
        ),
      },
    ],
    meta: {
      requiresAuth: true,
      role: "admin",
    },
  },
];

export default adminRoutes;
