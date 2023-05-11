import '../assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const  app = createApp(App)
app.use(ElementPlus)

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 定义全局分页参数
app.config.globalProperties.$pageSize = 20;
app.config.globalProperties.$pageSizeOptions = [20, 50, 100];

app.mount('#app')
