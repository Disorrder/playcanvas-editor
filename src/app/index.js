import './style.styl';
import './vendor';
import './extensions';

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        {name: 'projects', path: '/projects', component: require('app/pages/projects').default},
        {name: 'project', path: '/project/:id', component: require('app/pages/project').default},
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
    window.app = app;
});
