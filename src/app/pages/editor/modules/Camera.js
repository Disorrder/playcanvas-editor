export default class Camera {
    constructor(app) {
        this.app = app;
        this.entity = this.createEntity();
        this.attachEvents();
    }

    createEntity() {
        var entity = new pc.Entity('Perspective');
        entity.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        entity.setPosition(0, 0, 3);
        return entity;
    }

    attachEvents() {
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    }

    onMouseDown(e) {
        console.log('MD', e);
    }

    onMouseUp(e) {
        console.log('MU', e);
    }
}
