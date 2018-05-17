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
            state.selected = [];
            // state.selected.length = 0; // reactive watch is not triggering
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
    modules: {
        editor,
    },
    state: {
        projects: JSON.parse( localStorage.getItem('projects') ) || [],
    },
    mutations: {
        addProject(state, val) {
            state.projects.push(val);
            localStorage.projects = JSON.stringify(state.projects);
        },
        updateProject(state, val) {
            state.projects.find((v) => {
                if (v.id !== val.id) return false;
                Object.assign(v, val);
                return true;
            });
            localStorage.projects = JSON.stringify(state.projects);
        },
        deleteProject(state, val) {
            state.projects.delete(val);
            localStorage.projects = JSON.stringify(state.projects);
        },
        saveProjects(state, val) {
            state.projects = val;
            localStorage.projects = JSON.stringify(state.projects);
        },
    },
});

export default store;
