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
        position: {
            get() {
                return this.entity.getLocalPosition().toObject();
                // var v = this.entity.getLocalPosition().toObject();
                // v.x = Math.round(v.x * 1000) / 1000;
                // v.y = Math.round(v.y * 1000) / 1000;
                // v.z = Math.round(v.z * 1000) / 1000;
                // console.log('get', v);
                // return v;
            },
            set(v) {
                console.log('set', v);
                this.entity.setLocalPosition(v.x, v.y, v.z);
            }
        }
        // position() { return this.entity.getLocalPosition().toArray().map(v => Math.round(v*1000)/1000) },
        // rotation() { return this.entity.getEulerAngles().toArray().map(v => Math.round(v*1000)/1000) },
        // scale() { return this.entity.getLocalScale().toArray().map(v => Math.round(v*1000)/1000) },
    },
    watch: {
        // position(val) {
        //     console.log('w', val);
        //     val.forEach((v, i) => val[i] = Math.round(v*1000)/1000);
        //     console.log('w2', val);
        // }
    },
    methods: {
        translate(val) {},
        rotate(val) {},
        zoom(val) {},
    },

    created() {

    },
    mounted() {
        console.log('insp', this.entity, this.position);
    }
});
