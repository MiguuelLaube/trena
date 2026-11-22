import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Ordem importa: primeiro os tokens (variáveis), depois o CSS que usa eles
import './assets/tokens.css'
import './assets/base.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
