import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/css/reset.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)

app.mount('#app')
