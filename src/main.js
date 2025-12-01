import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/css/commons.css'
import './assets/styles/css/styles.css'
import './assets/styles/css/icons.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
