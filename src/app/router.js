import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        // main section
        {name: 'main', path: '/', component: require('app/pages/main').default,
            children: [
                {name: 'home', path: '/', component: require('app/pages/home').default},
                {name: 'projects', path: '/projects', component: require('app/pages/projects').default},
                {name: 'project', path: '/project/:id', component: require('app/pages/project').default},
            ]
        },
        // editor section
        {name: 'editor', path: '/editor/:projectId/:sceneId', component: require('app/pages/editor').default},
        {name: 'player', path: '/play/:projectId/:sceneId', component: require('app/pages/player').default},
    ]
});
