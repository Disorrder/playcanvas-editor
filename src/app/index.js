import './style.styl';
import './vendor';
import './utils';
import './extensions';

import Vue from 'vue';
import store from './store';
import router from './router';

$(() => {
    var app = new Vue({
        el: '#app',
        store,
        router,
        data: {
            theme: 'light',
        },
        created() {
            
        }
    });
    window.app = app;
});
