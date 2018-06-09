var vec3 = new pc.Vec3();
var vec3A = new pc.Vec3();

export default class Camera extends pc.Entity {
    constructor(app) {
        super('Perspective', app);

        this.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });

        this.picker = this.editor.picker;
        this.attachEvents();

        this.sensitivity = 0.2;
        this.orbitRadius = 1;
    }

    get editor() { return this._app._editor; }

    get moving() { return this._moving; }
    set moving(val) {
        this._moving = val;
        this.picker.busy = val ? 'camera' : null;
    }

    get pitch() { return this._pitch || 0; }
    set pitch(val) { this._pitch = pc.math.clamp(val, -90, 90); }
    get yaw() { return this._yaw || 0; }
    set yaw(val) { this._yaw = val; }

    attachEvents() {
        // this._app.on('update', this.update, this);
        this._app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this._app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        // this._app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this._app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);
    }

    onMouseDown(e) {
        if (e.element.id !== "canvas-3d") return;
        if (this.picker.busy || this.moving) return;
        // console.log('Cam: MD', e);

        this.moving = true;
        this._startEvent = e;
        $(document).on('mousemove.camera', this.onMouseMove.bind(this));
    }

    onMouseUp(e) {
        // if (e.element.id !== "canvas-3d") return;
        if (!this.moving) return;
        // console.log('Cam: MU', e);
        this.moving = false;

        this._startEvent = null;
        this._prevEvent = null;
        $(document).off('mousemove.camera');
    }

    onMouseMove(e) {
        // console.log('MM', e);
        if (!this._prevEvent) {
            this._prevEvent = e;
            return;
        };
        let dx = e.clientX - this._prevEvent.clientX;
        let dy = e.clientY - this._prevEvent.clientY;
        this._prevEvent = e;

        let [LMB, MMB, RMB] = this._app.mouse._buttons;

        if (e.shiftKey && LMB || LMB && RMB || MMB) {
            return this.translate(dx, dy);
        }
        if (LMB) { // this._app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)
            return this.lookAround(dx, dy);
        }
        if (RMB) { // this._app.mouse.isPressed(pc.MOUSEBUTTON_RIGHT)
            return this.lookOrbit(dx, dy);
        }
    }

    onMouseWheel(e) {
        // console.log('MW', e);
        this.zoom(e.wheel);
    }

    lookAround(dx, dy) {
        if (typeof dx === 'object') var e = dx;
        this.pitch -= dy * this.sensitivity;
        this.yaw -= dx * this.sensitivity;
        this.setLocalEulerAngles(this.pitch, this.yaw, 0);
    }

    lookOrbit(dx, dy) {
        vec3.copy(this.forward).scale(this.orbitRadius); // pivot vector
        super.translate(vec3);
        this.lookAround(dx, dy);
        vec3.copy(this.forward).scale(-this.orbitRadius);
        super.translate(vec3);
    }

    zoom(wheel) {
        this.orbitRadius -= wheel * this.sensitivity;
        this.orbitRadius = Math.max(1, this.orbitRadius);
        vec3.copy(this.forward).scale(wheel * this.sensitivity);
        super.translate(vec3);
    }

    translate(dx, dy) {
        // console.log('translate', dx, dy);
        vec3.copy(this.up).scale(dy * this.sensitivity * 0.1);
        vec3A.copy(this.right).scale(-dx * this.sensitivity * 0.1);
        vec3.add(vec3A);
        super.translate(vec3);
    }

    // update() {
    //
    // }
}
