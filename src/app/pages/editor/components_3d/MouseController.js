export default class MouseController {
    constructor(camera) {
        this.camera = camera; // pc.Entity type

        this.busy = null;
        this.state = 'ready';
        this.target = null; // entity or smth like that

        this.attachEvents();
    }
    
    get canvas() { return this._app.graphicsDevice.canvas; }
    get ready() { return this.state === 'ready' || this.state === 'hover'; }
    
    get camera() { return this._camera; }
    set camera(val) {
        if (!val) return;
        this._camera = val;
        this._app = val._app;
        this.editor = this._app._editor;
        this.picker = new pc.Picker(this._app, this.canvas.width, this.canvas.height);
    }

    attachEvents() {
        // this._app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        // this._app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        // this._app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        $(document).on('mousedown.editor', this.onMouseDown.bind(this));
        $(document).on('mouseup.editor', this.onMouseUp.bind(this));
        $(document).on('mousemove.editor', this.onMouseMove.bind(this));
    }
    detachEvents() {
        $(document).off('.editor');
    }

    mapEvent(e) {
        e.onCanvas = e.target === this.canvas;
        e.x = e.clientX;
        e.y = e.clientY;
        e.pointNear = this.camera.camera.screenToWorld(e.x, e.y, 0.1);
        e.mouseCtrl = this;

        this.point = e.pointNear;
    }

    onMouseDown(e) {
        if (e.target !== this.canvas) return;
        this.mapEvent(e);
        if (this.ready) {
            this.state = 'hold';
        }
    }

    onMouseUp(e) {
        // if (e.target !== this.canvas) return;
        this.mapEvent(e);
        if (this.state === 'hold') {
            this.state = 'ready'; // set state before action. May be strange?
            if (!this.target) {
                this._app.emit('picker:deselectAll');
                return;
            }
            var isEditorNode = this.target.findParents((v) => v.name === 'Editor Root');
            if (isEditorNode) return;
            this._app.emit('picker:select', this.target);
        }
        this.state = 'ready';
    }

    onMouseMove(e) {
        this.mapEvent(e);
        if (this.ready) {
            let entity = this.pickEntity(e.x, e.y);
            if (entity === this.target) return;

            this._app.emit('picker:leave', this.target);
            if (!entity) {
                this.state = 'ready';
            }
            if (entity) {
                this.state = 'hover';
                this._app.emit('picker:hover', entity);
            }
            this.target = entity;
        }
        if (this.state === 'hold') {
            this.state = 'drag';
        }
    }

    hover() {

    }

    pickEntity(...selection) {
        let camera = this.camera.camera;
        this.picker.prepare(camera, this._app.scene);
        let res = this.picker.getSelection(...selection);
        if (res.length) {
            return res[0].node.parent;
            // let entity = res[0].node;
            // while (!entity._guid) entity = entity.parent; // entity instanceof pc.GraphNode
            // return entity;
        }
    }
}
