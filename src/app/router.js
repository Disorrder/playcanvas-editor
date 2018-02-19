import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {name: 'projects', path: '/projects', component: require('app/pages/projects').default},
        {name: 'project', path: '/project/:id', component: require('app/pages/project').default},
        {name: 'editor', path: '/editor/:projectId/:sceneId', component: require('app/pages/editor').default}
    ]
});
