import './style.styl';

var icons = {
    top: 'fa-chevron-top',
    left: 'fa-chevron-left',
    right: 'fa-chevron-right',
    bottom: 'fa-chevron-bottom',
};

import Vue from 'vue';
Vue.component('pc-entity', {
    props: {
        entity: Object
    },
    template: require('./template.pug')(),
    data() {
        return {
            opened: false,
        }
    },
    computed: {
        isFolder() { return this.entity.children && this.entity.children.length; },
    },
    methods: {
        toggle() {
            if (!this.isFolder) return;
            this.opened = !this.opened;
        },
    },
    mounted() {

    }
});
