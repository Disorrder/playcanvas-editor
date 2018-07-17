import './style.styl';

import Vue from 'vue';
Vue.component('pc-entity-inspector', {
    props: {
        entity: Object
    },
    template: require('./template.pug')(),
    data() {
        return {
            componentMeta: {
                model: {
                    header: 'Model',
                    // type: ['//asset', 'plane', 'box', 'sphere', 'capsule', 'cylinder', 'cone'],
                    type: [
                        // {value: 'asset',    text: 'Asset'},
                        {value: 'plane',    text: 'Plane'},
                        {value: 'box',      text: 'Box'},
                        {value: 'sphere',   text: 'Sphere'},
                        {value: 'capsule',  text: 'Capsule'},
                        {value: 'cylinder', text: 'Cylinder'},
                        {value: 'cone',     text: 'Cone'},
                    ],
                    // material: 
                }
            }
        }
    },
    computed: {
        position() { return this.entity.getLocalPosition(); },
        rotation() { return this.entity.getEulerAngles(); },
        scale() { return this.entity.getLocalScale(); },
    },
    watch: {
        // entity(val) {
            
        // }
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
