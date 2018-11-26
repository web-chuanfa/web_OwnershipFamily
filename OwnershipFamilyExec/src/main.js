import Vue from 'vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import $ from 'jquery';
import axios from 'axios';

import API from './assets/js/api.js'
Vue.prototype.$API = API;

Vue.use(ElementUI)
import 'element-ui/lib/theme-chalk/index.css'

import App from 'src/App'

window.eventBus = new Vue();

Vue.prototype.axios = axios;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    render: (h) => h(App)
})
