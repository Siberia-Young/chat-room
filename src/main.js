import {
  createApp
} from 'vue'
import App from './App.vue'

import axios from 'axios'
import request from '@/utils/request'
import uuidPlugin from '@/utils/uuidPlugin';

import router from '@/router'
import store from '@/store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import EmojiHandler from '@/utils/emojiHandler'

app.config.globalProperties.$emojiHandler = new EmojiHandler()

app.config.globalProperties.$axios = axios
app.config.globalProperties.$request = request

app.use(uuidPlugin)


app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')