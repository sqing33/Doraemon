import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {defineAsyncComponent} from "vue";
import {useStore} from "vuex";
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
        name: "blog",
        children: [
            {
                path: "",
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
                beforeEnter: (to, from, next) => {
                    const store = useStore();
                    if (store.getters.getUserInfo) {
                        next();
                    } else {
                        next("/login");
                    }
                },
            },
        ],
    },
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
    {
        path: "/gpt",
        name: "gpt",
        component: defineAsyncComponent(() => import("@/components/gpt.vue")),
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
