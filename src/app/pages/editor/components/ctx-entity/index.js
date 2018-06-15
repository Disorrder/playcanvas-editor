import './style.styl';

import Vue from 'vue';
Vue.component('ctx-entity', {
    props: {
        // items: Array
    },
    template: require('./template.pug')(),
    data() {
        return {
            opened: false,
            clickedItem: null,
        }
    },
    computed: {
        items() { return this.clickedItem ? [this.clickedItem] : this.$store.state.editor.selected; },
        containsEnabled() { return this.items.some((v) => v.enabled); },
        containsDisabled() { return this.items.some((v) => !v.enabled); },
    },
    methods: {
        open() {
            this.opened = true;
        },
        close() {
            this.clickedItem = null;
            this.opened = false;
        },

        toggle() {
            this.opened = !this.opened;
        },

        onContextmenu(e) {
            var clickedItem = this.findItem(e);
            if (!this.items.includes(clickedItem)) {
                this.clickedItem = clickedItem;
                console.log('clicked on', clickedItem);
            }
            console.log('ctx open', this.items);

            var $target = $(e.currentTarget);
            var pos = $target.position();
            var width = $target.width();
            this.$el.style.top = pos.top;
            this.$el.style.left = pos.left + width;
            this.opened = true;
        },

        onClick(e) {
            var inside = $(e.target).parents().toArray().includes(this.$el);
            if (inside) {
                e.preventDefault();
                return false;
            };

            this.opened = false;
        },

        findItem(e) {
            let target = e.target;
            while (!target.__vue__) target = target.parentElement;
            return target.__vue__.entity;
        },

        // actions
        createEntity() {
            var entity = new pc.Entity();
            entity.name = 'New Entity';
            this.items[0].addChild(entity);
            console.log('create entity!', this.items[0]);
            return entity;
        },
        createModel(type) {
            var entity = this.createEntity();
            if (type) {
                entity.addComponent('model', {type});
                entity.name = type.capitalize();
            }
        },
        createLight(type) {
            var entity = this.createEntity();
            if (type) {
                entity.addComponent('light', {type});
                entity.name = type.capitalize() + ' Light';
            }
            if (type === 'directional') {
                entity.setLocalEulerAngles(60, 30, 0);
            }
        },
        createCamera(type) {
            var entity = this.createEntity();
            if (type) {
                entity.addComponent('camera', {type});
                entity.name = type.capitalize() + ' Camera';
            }
        },

        addComponent(name, data) {
            this.items.forEach((entity) => {
                entity.addComponent(name, data);
            });
        },

        enableItems() {
            this.items.forEach((v) => {
                v.enabled = true;
            });
            this.close();
        },
        disableItems() {
            this.items.forEach((v) => {
                v.enabled = false;
            });
            this.close();
        },

        deleteItems() {
            this.items.forEach((v) => {
                v.destroy();
            });
            this.close();
        },
        delete_hover(bool) {
            this.items.forEach((v) => {
                this.$set(v, '__deleting', bool); // make reactive
                console.log('hov', v, bool);
            });
        },
    },
    mounted() {
        $(document)
            .on(`contextmenu.ctx-entity`, `.pc-entity-item`, this.onContextmenu.bind(this))
            .on(`click.ctx-entity`, this.onClick.bind(this))
        ;

        // this.simpleMat = new pc.Material();

    },
    beforeDestroy() {
        $(document).off(`.ctx-entity`);
    }
});
