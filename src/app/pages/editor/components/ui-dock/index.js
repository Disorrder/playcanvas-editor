import './style.styl';

var icons = {
    top: 'keyboard_arrow_top',
    left: 'keyboard_arrow_left',
    right: 'keyboard_arrow_right',
    bottom: 'keyboard_arrow_bottom',
};

import Vue from 'vue';
Vue.component('ui-dock', {
    props: {
        ariaOpened: Boolean
    },
    template: require('./template.pug')(),
    data() {
        return {
            position: null,
            opened: this.ariaOpened == null ? true : this.ariaOpened,
        }
    },
    computed: {
        toggleIcon() {
            if (!this.position) return '';
            if (this.position === 'left') return this.opened ? icons.left : icons.right;
            if (this.position === 'right') return this.opened ? icons.right : icons.left;
            console.warn('ToggleIcon:', this.position, this.opened);
            return '';
        },
        // position() {
        //
        // }
    },
    methods: {
        toggle() {
            this.opened = !this.opened;
        }
    },
    mounted() {
        console.log(this.$el, this.$el.classList.contains('opened'), this.ariaOpened);
        // this.opened = this.ariaOpened || this.$el.classList.contains('opened');

        if (this.$el.classList.contains('ui-dock-left')) console.log('left!'), this.position = 'left';
        if (this.$el.classList.contains('ui-dock-right')) console.log('left!'), this.position = 'right';
    }
});
