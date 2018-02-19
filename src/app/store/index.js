import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var editor = {
    namespaced: true,
    state: {
        selected: []
    },
    mutations: {
        selectOne(state, entity) {
            state.selected.length = 0;
            state.selected.push(entity);
        },
        selectAdd(state, entity) {
            var i = state.selected.indexOf(entity);
            if (~i) state.selected.push(entity);
        },
        deselectOne(state, entity) {
            var i = typeof entity === 'number' ? entity : state.selected.indexOf(entity);
            if (~i) state.selected.splice(i, 1);
        },
        deselectAll(state) {
            state.selected.length = 0;
        },
        toggleOne(state, entity) {
            var i = state.selected.indexOf(entity);
            if (~i) {
                state.selected.splice(i, 1);
            } else {
                state.selected.push(entity);
            }
        }
    },
    actions: {

    }
};

var store = new Vuex.Store({
    state: {
        // projects: [],
        // scenes: []
    },
    mutations: {
        // setProjects(state, val) { state.projects = val; },
        // setScenes(state, val) { state.scenes = val; },
    },
    modules: {
        editor
    }
});

export default store;
