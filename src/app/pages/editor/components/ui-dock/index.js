import './style.styl';

var icons = {
    top: 'fa-chevron-top',
    left: 'fa-chevron-left',
    right: 'fa-chevron-right',
    bottom: 'fa-chevron-bottom',
};

import Vue from 'vue';
Vue.component('ui-dock', {
    props: ['aria-hidden'],
    template: require('./template.pug')(),
    data() {
        return {
            position: null,
            hidden: this.ariaHidden,
        }
    },
    computed: {
        toggleIcon() {
            if (!this.position) return '';
            if (this.position === 'left') return this.hidden ? icons.right : icons.left;
            if (this.position === 'right') return this.hidden ? icons.left : icons.right;
            console.warn('ToggleIcon:', this.position, this.hidden);
            return '';
        },
        // position() {
        //
        // }
    },
    methods: {
        toggle() {
            this.hidden = !this.hidden;
        }
    },
    mounted() {
        console.log(this.$el, this.$el.classList.contains('hidden'), this.ariaHidden);
        // this.hidden = this.ariaHidden || this.$el.classList.contains('hidden');

        if (this.$el.classList.contains('ui-dock-left')) console.log('left!'), this.position = 'left';
        if (this.$el.classList.contains('ui-dock-right')) console.log('left!'), this.position = 'right';
    }
});
