import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {defineAsyncComponent} from "vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: defineAsyncComponent(() => import("@/components/index.vue")),
    },
    {
        path: "/author",
        component: defineAsyncComponent(() => import("@/components/AuthorIntro.vue")),
    },
    {
        path: "/character",
        component: defineAsyncComponent(() => import("@/components/CharactIntro.vue")),
    },
    {
        path: "/news",
        component: defineAsyncComponent(() => import("@/components/News.vue")),
    },
    {
        path: "/newsPage/:id",
        name: "newsPage",
        component: defineAsyncComponent(() => import("@/components/NewsPage.vue")),
        props: true,
    },
    {
        path: "/adminLogin",
        component: defineAsyncComponent(() => import("@/components/admin/login.vue")),
    },
    {
        path: "/admin",
        component: defineAsyncComponent(() => import("@/views/admin.vue")),
        children: [
            {
                path: "",
                component: defineAsyncComponent(() => import("@/components/admin/index.vue")),
            },
            {
                path: "addNews",
                component: defineAsyncComponent(() => import("@/components/admin/addNews.vue")),
            },
            {
                path: "newsList",
                component: defineAsyncComponent(() => import("@/components/admin/newsList.vue")),
            },
        ],
    },
    {
        path: "/login",
        component: defineAsyncComponent(() => import("@/components/user/login.vue")),
    },
    {
        path: "/regist",
        component: defineAsyncComponent(() => import("@/components/user/regist.vue")),
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
