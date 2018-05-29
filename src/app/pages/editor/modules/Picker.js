export default class Picker {
    constructor(app) {
        this.app = app;
        this.state = 'ready'; // one of 'hover', 'click', 'drag'
        this.target = null; // entity or smth like that

        var canvas = $('#canvas-3d');
        this.picker = new pc.Picker(this.app, canvas.width(), canvas.height());
        this.attachEvents();
    }

    attachEvents() {
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);
    }

    onMouseDown() {

    }

    onMouseUp() {

    }

    onMouseMove(e) {
        if (e.element.id !== "canvas-3d") return;
        console.log('P: MM', e);
        if (this.state === 'ready' || this.state === 'hover') {
            let entity = this.pickEntity(e.x, e.y);
            if (entity === this.target) return;

            this.app.emit('picker:leave', this.target);
            console.log('pickel:leave', this.target, this.target.name);
            if (!entity) {
                this.state = 'ready';
            }
            if (entity) {
                this.state = 'hover';
                this.app.emit('picker:hover', entity);
                console.log('pickel:hover', entity, entity.name);
            }
            this.target = entity;
        };

    }

    onMouseWheel() {

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
