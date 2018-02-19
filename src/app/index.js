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
