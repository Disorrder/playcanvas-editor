export default class Camera {
    constructor(app) {
        this.app = app;
        this.entity = this.createEntity();
        this.attachEvents();

        this.moving = false;
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

    attachEvents() {
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        // this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    }

    onMouseDown(e) {
        console.log('MD', e);
        if (this.moving) return;
        this.moving = true;
        this._startEvent = e;
        $(document).on('mousemove.camera', this.onMouseMove.bind(this));
    }

    onMouseUp(e) {
        console.log('MU', e);
        if (!this.moving) return;
        this.moving = false;
        this._startEvent = null;
        $(document).off('mousemove.camera');
    }

    onMouseMove(e) {
        // var btns = [0, 1, 2].map((v) => this.app.mouse.isPressed(v));
        console.log('MM', e);

        if (this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
            return this.lookAround(e);
        }

    }

    lookAround(e) {
        console.log('look around');
    }

    lookOrbit(e) {

    }
}
