var vec3 = new pc.Vec3();
var vec3A = new pc.Vec3();

export default class Camera {
    constructor(app) {
        this.app = app;
        this.entity = this.createEntity();
        this.attachEvents();

        this.moving = false;
        this.sensitivity = 0.2;
        this.orbitRadius = 1;
    }

    createEntity() {
        var entity = new pc.Entity('Perspective');
        entity.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        entity.setPosition(0, 0, 3);
        return entity;
    }

    get camera() { return this.entity.camera; }

    get pitch() { return this._pitch || 0; }
    set pitch(val) { this._pitch = pc.math.clamp(val, -90, 90); }
    get yaw() { return this._yaw || 0; }
    set yaw(val) { this._yaw = val; }

    attachEvents() {
        // this.app.on('update', this.update, this);
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        // this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);
    }

    onMouseDown(e) {
        // console.log('MD', e);
        if (this.moving) return;
        // if (this.moving) {
        //     $(document).off('mousemove.camera');
        // };
        this.moving = true;
        this._startEvent = e;
        $(document).on('mousemove.camera', this.onMouseMove.bind(this));
    }

    onMouseUp(e) {
        // console.log('MU', e);
        if (!this.moving) return;
        this.moving = false;
        this._startEvent = null;
        this._prevEvent = null;
        $(document).off('mousemove.camera');
    }

    onMouseMove(e) {
        console.log('MM', e);
        if (!this._prevEvent) {
            this._prevEvent = e;
            return;
        };
        let dx = e.clientX - this._prevEvent.clientX;
        let dy = e.clientY - this._prevEvent.clientY;
        this._prevEvent = e;

        let [LMB, MMB, RMB] = this.app.mouse._buttons;

        if (e.shiftKey && LMB || LMB && RMB || MMB) {
            return this.translate(dx, dy);
        }
        if (LMB) { // this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)
            return this.lookAround(dx, dy);
        }
        if (RMB) { // this.app.mouse.isPressed(pc.MOUSEBUTTON_RIGHT)
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
        this.entity.setLocalEulerAngles(this.pitch, this.yaw, 0);
    }

    lookOrbit(dx, dy) {
        vec3.copy(this.entity.forward).scale(this.orbitRadius); // pivot vector
        this.entity.translate(vec3);
        this.lookAround(dx, dy);
        vec3.copy(this.entity.forward).scale(-this.orbitRadius);
        this.entity.translate(vec3);
    }

    zoom(wheel) {
        this.orbitRadius -= wheel * this.sensitivity;
        this.orbitRadius = Math.max(1, this.orbitRadius);
        vec3.copy(this.entity.forward).scale(wheel * this.sensitivity);
        this.entity.translate(vec3);
    }

    translate(dx, dy) {
        // console.log('translate', dx, dy);
        vec3.copy(this.entity.up).scale(-dy * this.sensitivity * 0.1);
        vec3A.copy(this.entity.right).scale(dx * this.sensitivity * 0.1);
        vec3.add(vec3A);
        this.entity.translate(vec3);
    }

    // update() {
    //
    // }
}
