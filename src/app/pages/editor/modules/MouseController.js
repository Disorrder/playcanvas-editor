export default class MouseController {
    constructor(camera) {
        this.camera = camera; // pc.Entity type
        console.log('qwe', camera);
        this._app = camera._app;
        this.editor = this._app._editor;

        this.busy = null;
        this.state = 'ready';
        this.target = null; // entity or smth like that

        this.picker = new pc.Picker(this._app, this.canvas.width, this.canvas.height);
        this.attachEvents();
    }

    get canvas() { return this._app.graphicsDevice.canvas; }
    get ready() { return this.state === 'ready' || this.state === 'hover'; }

    attachEvents() {
        // this._app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        // this._app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        // this._app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        $(document).on('mousedown.editor', this.onMouseDown.bind(this));
        $(document).on('mouseup.editor', this.onMouseUp.bind(this));
        $(document).on('mousemove.editor', this.onMouseMove.bind(this));

    }

    onMouseDown(e) {

    }

    onMouseUp(e) {

    }

    onMouseMove(e) {
        // console.log('mm', e);
    }

    hover() {

    }

    pickEntity(...selection) {
        let camera = this.camera.camera;
        this.picker.prepare(camera, this.app.scene);
        let res = this.picker.getSelection(...selection);
        if (res.length) {
            return res[0].node.parent;
            // let entity = res[0].node;
            // while (!entity._guid) entity = entity.parent; // entity instanceof pc.GraphNode
            // return entity;
        }
    }
}
