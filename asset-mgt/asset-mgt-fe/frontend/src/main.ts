// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Import Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css'

// Import application styles (includes variables, base, main, and form styles)
import './assets/styles/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize auth status from localStorage
const authStore = useAuthStore()
authStore.checkAuthStatus()


app.mount('#app')
