import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import process from 'process/browser';
import { Buffer } from 'buffer';

window.process = process;
window.Buffer = Buffer;

import { setupAuthListener } from './services/authListener';

setupAuthListener();

createApp(App).use(router).mount('#app');
