import {createApp} from "vue";
import {store} from "./store";
// @ts-ignore
import App from "./App.vue";
// @ts-ignore
import router from "./router";

// 引入 ElementPlus 样式
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/display.css";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus);

app.mount("#app");
