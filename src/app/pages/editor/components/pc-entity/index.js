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
        // only instanceof pc.Entity has _guid
        children() { return this.entity.children && this.entity.children.filter((v) => v._guid); },
        isFolder() { return this.children && this.children.length; },
        isSelected() { return this.$store.state.editor.selected.includes(this.entity); },
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
