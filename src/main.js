import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import MsToast from '@/components/ms-toast/MsToast.vue'
import AntDesign from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './assets/styles/css/commons.css'
import './assets/styles/css/styles.css'
import './assets/styles/css/icons.css'

const app = createApp(App)
app.use(router)
app.use(MsToast)
app.use(AntDesign)
app.mount('#app')
