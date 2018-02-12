import './vendor';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        {name: 'projects', path: '/projects', component: require('app/projects')},
        // {name: 'editor', path: '/editor', component: require('app/editor')}
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
