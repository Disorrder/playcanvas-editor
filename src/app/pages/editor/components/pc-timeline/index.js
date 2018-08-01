import './style.styl';
import Vue from 'vue';

const path = window.require('path');

Vue.component('pc-timeline', {
    template: require('./template.pug')(),
    props: {
        file: String,
    },
    data() {
        return {

        }
    },
    computed: {
        data() {
            if (!this.file) return;
            let filePath = 0;
            return window.require(this.file);
        },
        // timeline() {
        //     return new pc.Timeline()
        // },
        frames() {
            if (!this.data) return [];
            let frames = this.data.frames;

            // calculate offsets
            frames.forEach(frame, i => {
                var prevOffset = 0;
                if (i) prevOffset = frames[i-1]._startTime || 0; //? 0?

                if (frame.offset) {
                    frame._startTime = frame._startTime;
                } else {
                    frame._startTime = prevOffset + frame.delay;
                }
            });
        },
    },
    methods: {

    },
    mounted() {

    }
});
