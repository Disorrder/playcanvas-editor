const digitExp = /\d/;
const dotLastExp = /\.$/;

import Vue from 'vue';
Vue.component('i-number', {
    props: {
        fix: { type: Number, default: 3 },
        value: { required: true },
    },
    template: require('./template.pug')(),
    data() {
        return {
            allowedChars: "0123456789-.e",
        }
    },
    computed: {
        viewVal() {
            let fix = Math.pow(10, this.fix);
            return Math.round(this.value * fix) / fix;
            // return this.value.toFixed(this.fix);
        }
    },
    methods: {
        onKeydown(e) {
            // Отменяет ввод символов, не относящихся к числу
            // console.log('kd', e);
            if (e.altKey || e.ctrlKey || e.metaKey) return;

            if (e.key.length === 1 && this.allowedChars.indexOf(e.key) < 0) {
                e.preventDefault();
                return false;
            }
        },

        onInput() {
            console.log('inp', this.$el.value, this.value);
            let val = this.$el.value;
            if (!digitExp.test(val)) return;
            if (dotLastExp.test(val)) return;

            let dot = val.indexOf('.');
            if (~dot) {
                val = val.substr(0, dot + this.fix + 1);
            }
            this.$emit('input', val);
            this.$el.value = val;
        },
    }
});