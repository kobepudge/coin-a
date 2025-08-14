import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import App from './App.vue'
import router from './router'

// 样式导入
import './assets/styles/main.css'
import './assets/styles/responsive.css'

const app = createApp(App)

// 安装插件
app.use(createPinia())
app.use(router)
app.use(naive)

// 全局属性
app.config.globalProperties.$NAIVE = naive

// 挂载应用
app.mount('#app')
