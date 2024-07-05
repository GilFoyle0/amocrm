import './assets/main.css'

import { createApp } from 'vue'

//@ts-ignore
import App from './App.vue'
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';

createApp(App).use(Antd).mount('#app')
