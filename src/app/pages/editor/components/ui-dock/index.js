import './style.styl';

var icons = {
    top: 'keyboard_arrow_top',
    left: 'keyboard_arrow_left',
    right: 'keyboard_arrow_right',
    bottom: 'keyboard_arrow_bottom',
};

import Vue from 'vue';

var uiDock = {
    props: {
        dataOpened: Boolean,
    },
    template: require('./template.pug')(),
    data() {
        return {
            position: 'left',

            iconOpened: icons.left,
            iconClosed: icons.right,
        }
    },

    computed: {
        classPosition() { return "ui-dock-" + this.position; },
        iconToggle() {
            return this.opened ? this.iconOpened : this.iconClosed;
        },

        styles() { return null; }
    },

    mounted() {
        if (this.dataOpened != null) this.opened = this.dataOpened;
    }
};

Vue.component('ui-dock', {
    mixins: [uiDock],
    props: {
        left: Boolean,
        right: Boolean,
        bottom: Boolean,
        // dataPosition: String,
    },
    data() {
        return {
            opened: false,
        }
    },
    computed: {
        dataPosition() {
            if (this.left) return 'left';
            if (this.right) return 'right';
            if (this.bottom) return 'bottom';
        },
    },
    methods: {
        toggle() {
            this.opened = !this.opened;
        }
    },
    mounted() {
        if (this.dataPosition != null) this.position = this.dataPosition;
    }
});

// --- Modified ---

var uiDockStore = {
    data() {
        return {
            name: 'leftDock',
        }
    },
    computed: {
        store() { return this.$store.state.editor[this.name]; },
        // opened() { return this.store.opened; },
        opened: {
            get() { return this.store.opened; },
            set(val) { this.store.opened = val; }
            // set(val) {
            //     val
            //         ? this.$store.commit('editor/openDock', this.name)
            //         : this.$store.commit('editor/closeDock', this.name)
            //     ;
            // }
        },
    },
    methods: {
        toggle() {
            this.opened = !this.opened;
        }
    },
};

var uiDockResizable = {
    data() {
        return {
            sizeClamp: [200, 500],
            resizable: true,
            draggedOffset: 'offsetX',
            resizeDirection: 1,
        }
    },
    computed: {
        store() { return this.$store.state.editor[this.name]; },
        size: {
            get() { return this.store.size; },
            set(val) { this.$store.commit('editor/resizeDock', {name: this.name, value: val}); }
        },
    },
    methods: {
        onDragged(e) {
            if (e.first) {
                this._startSize = this.size;
            }
            if (e[this.draggedOffset]) {
                // let size = 
                this.size = this._startSize + e[this.draggedOffset] * this.resizeDirection;
                this.size = Math.clamp(this.size, ...this.sizeClamp);
                console.log('ERT', this.size);
                
            }
        }
    },
    mounted() {
        this.resizeHandler = this.$el.getElementsByClassName('ui-dock-resize')[0];

    }
}


Vue.component('ui-dock-left', {
    mixins: [uiDock, uiDockStore, uiDockResizable],
    data() {
        return {
            name: 'leftDock',
            position: 'left',
            iconOpened: icons.left,
            iconClosed: icons.right,

            draggedOffset: 'offsetX',
            resizeDirection: 1,
        }
    },
    computed: {
        styles() {
            let bottomDock = this.$store.state.editor.bottomDock;
            console.log('bodo', bottomDock, bottomDock.opened);
            
            return {
                width: this.size,
                bottom: bottomDock.opened ? bottomDock.size : null
            }
        },
    },
});

Vue.component('ui-dock-right', {
    mixins: [uiDock, uiDockStore, uiDockResizable],
    data() {
        return {
            name: 'rightDock',
            position: 'right',
            iconOpened: icons.right,
            iconClosed: icons.left,

            draggedOffset: 'offsetX',
            resizeDirection: -1,
        }
    },
    computed: {
        styles() {
            return {
                width: this.size,
            }
        },
    }
});

Vue.component('ui-dock-bottom', {
    mixins: [uiDock, uiDockStore, uiDockResizable],
    data() {
        return {
            name: 'bottomDock',
            position: 'bottom',
            iconOpened: icons.bottom,
            iconClosed: icons.top,

            draggedOffset: 'offsetY',
            resizeDirection: -1,
        }
    },
    computed: {
        styles() {
            let rightDock = this.$store.state.editor.rightDock;
            return {
                height: this.size,
                right: rightDock.opened ? rightDock.size : null
            }
        },
    }
});
