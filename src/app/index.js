import './style.styl';
import './vendor';
import './utils';
import './extensions';

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        {name: 'projects', path: '/projects', component: require('app/pages/projects').default},
        {name: 'project', path: '/project/:id', component: require('app/pages/project').default},
        {name: 'editor', path: '/editor/:projectId/:sceneId', component: require('app/pages/editor').default}
    ]
});

$(() => {
    var app = new Vue({
        el: '#app',
        router,
        data: {
            user: null,
            projects: null,
            scenes: null,
        },
        created() {
            this.projects = JSON.parse( localStorage.getItem('projects') ) || [];
        }
    });
    window.app = app;
});
