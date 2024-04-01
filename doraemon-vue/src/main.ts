import {createApp} from "vue";
// @ts-ignore
import App from "./App.vue";
// @ts-ignore
import router from "./router";

// 引入 ElementPlus 样式
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 引入 Bootstrap 样式
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";


const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.mount("#app");
