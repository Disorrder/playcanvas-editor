import './style.styl';

var icons = {
    top: 'keyboard_arrow_top',
    left: 'keyboard_arrow_left',
    right: 'keyboard_arrow_right',
    bottom: 'keyboard_arrow_bottom',
};

import Vue from 'vue';
import { switchCase } from 'babel-types';
Vue.component('ui-dock', {
    props: {
        left: Boolean,
        right: Boolean,
        bottom: Boolean,
        dataOpened: Boolean,
    },
    template: require('./template.pug')(),
    data() {
        return {
            position: 'left',
            opened: false,

            iconOpened: icons.left,
            iconClosed: icons.right,
        }
    },
    computed: {
        dataPosition() {
            // if (this.top) return 'top';
            if (this.left) return 'left';
            if (this.right) return 'right';
            if (this.bottom) return 'bottom';
        },
        classPosition() { return "ui-dock-" + this.position; },
        iconToggle() {
            return this.opened ? this.iconOpened : this.iconClosed;
        },
    },
    methods: {
        toggle() {
            this.opened = !this.opened;
        }
    },
    mounted() {
        if (this.dataOpened != null) this.opened = this.dataOpened;
        if (this.dataPosition != null) this.position = this.dataPosition;

        switch (this.position) {
            case 'left':
                this.iconOpened = icons.left;
                this.iconClosed = icons.right;
                break;
            case 'right':
                this.iconOpened = icons.right;
                this.iconClosed = icons.left;
                break;
            case 'bottom':
                this.iconOpened = icons.bottom;
                this.iconClosed = icons.top;
                break;
        }
    }
});
