import './style.styl';
import './vendor';
import './extensions';

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        {name: 'scenes', path: '/scenes', component: require('app/pages/scenes').default},
        {name: 'editor', path: '/editor', component: require('app/pages/editor').default}
    ]
});

$(() => {
    var app = new Vue({
        el: '#app',
        router,
        data: {
            q: 'Hi there'
        }
    });
});
