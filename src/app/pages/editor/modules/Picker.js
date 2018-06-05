export default class Picker {
    constructor(app) {
        this.app = app;
        this.state = 'ready'; // one of 'hover', 'click', 'drag', 'hold'
        this.target = null; // entity or smth like that

        var canvas = $('#canvas-3d');
        this.picker = new pc.Picker(this.app, canvas.width(), canvas.height());
        this.attachEvents();
    }

    attachEvents() {
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        // this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);
    }

    onMouseMove(e) {
        if (e.element.id !== "canvas-3d") return;
        if (this.state === 'ready' || this.state === 'hover') {
            let entity = this.pickEntity(e.x, e.y);
            if (entity === this.target) return;

            this.app.emit('picker:leave', this.target);
            console.log('picker:leave', this.target, this.target?this.target.name:'');
            if (!entity) {
                this.state = 'ready';
            }
            if (entity) {
                this.state = 'hover';
                this.app.emit('picker:hover', entity);
                console.log('picker:hover', entity, entity.name);
            }
            this.target = entity;
        }
        if (this.state === 'hold') {
            this.state = 'drag';
        }
    }

    onMouseDown(e) {
        if (e.element.id !== "canvas-3d") return;
        if (this.state === 'ready' || this.state === 'hover') {
            this.state = 'hold';
        }
    }

    onMouseUp(e) {
        if (e.element.id !== "canvas-3d") return;
        if (this.state === 'hold') {
            this.state = 'ready'; // set state before action. May be strange?
            if (!this.target) {
                this.app.emit('picker:deselectAll');
                return;
            }
            var isEditorNode = this.target.findParents((v) => v.name === 'Editor Root');
            if (isEditorNode) return;
            this.app.emit('picker:select', this.target);
            console.log('picker:select', this.target.name, this.target);
        }
        this.state = 'ready';
    }

    onResize() {

    }

    pickEntity(...selection) {
        let camera = this.app._editor.activeCamera.camera;
        this.picker.prepare(camera, this.app.scene);
        let res = this.picker.getSelection(...selection);
        if (res.length) {
            let entity = res[0].node;
            while (!entity._guid) entity = entity.parent; // entity instanceof pc.GraphNode
            return entity
            // console.log('Pick', selection, entity);
            // if (!this.selected.includes(entity)) this.selectEntity(entity);
        } else {
            // this.deselectAll();
        }
    }
}
