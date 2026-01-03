import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import adminRoutes from "./admin";
import usersRoutes from "./users";

const routes: RouteRecordRaw[] = [
  // 首页重定向到博客
  {
    path: "/",
    redirect: "/blog"
  },

  // 博客页面（作为首页）
  {
    path: "/blog",
    children: [
      {
        path: "",
        name: "blog",
        component: defineAsyncComponent(
          () => import("@/components/blog/index.vue")
        ),
      },
      {
        path: ":id",
        name: "blogPage",
        component: defineAsyncComponent(
          () => import("@/components/blog/blogPage.vue")
        ),
        props: true,
      },
      {
        path: "postBlog",
        component: defineAsyncComponent(
          () => import("@/components/blog/postBlog.vue")
        ),
      },
    ],
  },

  // 动漫详情页面（新增）
  {
    path: "/anime/:animeId",
    name: "animeDetail",
    component: defineAsyncComponent(
      () => import("@/components/anime/AnimeDetail.vue")
    ),
    props: true,
    children: [
      {
        path: "",
        redirect: "author"
      },
      {
        path: "author",
        name: "animeAuthor",
        component: defineAsyncComponent(
          () => import("@/components/anime/AnimeAuthor.vue")
        ),
      },
      {
        path: "character",
        name: "animeCharacter",
        component: defineAsyncComponent(
          () => import("@/components/anime/AnimeCharacter.vue")
        ),
      },
      {
        path: "website",
        name: "animeWebsite",
        component: defineAsyncComponent(
          () => import("@/components/anime/AnimeWebsite.vue")
        ),
      },
    ],
  },

  // 保留原有路由用于向后兼容
  {
    path: "/author",
    redirect: "/anime/doraemon/author"
  },
  {
    path: "/character",
    redirect: "/anime/doraemon/character"
  },
  {
    path: "/website",
    redirect: "/anime/doraemon/website"
  },

  // 新闻活动
  {
    path: "/news",
    name: "news",
    children: [
      {
        path: "",
        component: defineAsyncComponent(
          () => import("@/components/news/index.vue")
        ),
      },
      {
        path: ":id",
        name: "newsPage",
        component: defineAsyncComponent(
          () => import("@/components/news/newsPage.vue")
        ),
        props: true,
      },
    ],
  },

  // 原首页（可选保留）
  {
    path: "/home",
    component: defineAsyncComponent(() => import("@/components/index.vue")),
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

router.beforeEach((to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (to.meta.role === "admin" && !adminToken) {
      next("/adminLogin");
    } else if (to.meta.role === "user" && !token) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
