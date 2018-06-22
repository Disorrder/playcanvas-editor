import './style.styl';

import Vue from 'vue';
Vue.component('pc-entity-inspector', {
    props: {
        entity: Object
    },
    template: require('./template.pug')(),
    data() {
        return {

        }
    },
    computed: {
        position() { return this.entity.getLocalPosition(); },
        rotation() { return this.entity.getEulerAngles(); },
        scale() { return this.entity.getLocalScale(); },
    },
    watch: {
        entity(val) {
            
        }
    },
    methods: {
        setPosition() {
            this.entity.setLocalPosition(this.position);
        },
        setRotation() {
            this.entity.setEulerAngles(this.rotation);
        },
        setScale() {
            this.entity.setLocalScale(this.scale);
        },
        translate(val) {},
        rotate(val) {},
        zoom(val) {},
    },

    created() {

    },
    mounted() {

    }
});
