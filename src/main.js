// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import store from './vuex/store';

import './common/stylus/index.styl';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(MintUI);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    data: {
        eventHub: new Vue()
    }
});