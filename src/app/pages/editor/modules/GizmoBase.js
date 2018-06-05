const gizmoSize = .4;

var vecA = new pc.Vec3();

export default class GizmoBase {
    constructor(app) {
        this.app = app;
        this.entities = this.createEntity();
        this.entity = this.entities.root;

        this.attachEvents();
        this.app._editor.needUpdate = true;
    }

    attachEvents() {
        // this.app.on('editor:postUpdate', this._render = this.render.bind(this));
        this.app.on('editor:postUpdate', this.render, this);
    }
    detachEvents() {
        // this.app.off('editor:postUpdate', this._render);
    }

    setPosition(...vec) {
        this.entity.setLocalPosition(...vec);
        this.render(); // or set needUpdate
    }
    setRotation(...vec) {

    }

    update() {

    }

    render() {
        if (!this.entity.enabled) return;

        var pos = this.entity.getPosition();
        var camera = this.app._editor.activeCamera;
        var cameraPos = camera.getPosition();

        // scale to screen space
        let scale = 1;
        if (camera.camera.projection === pc.PROJECTION_PERSPECTIVE) {
            let dot = vecA.copy(pos).sub(cameraPos).dot(camera.forward);
            let denom = 1280 / (2 * Math.tan(camera.camera.fov * pc.math.DEG_TO_RAD / 2));
            scale = Math.max(0.0001, (dot / denom) * 150) * gizmoSize;
        } else {
            scale = camera.camera.orthoHeight / 3 * gizmoSize;
        }
        this.entity.setLocalScale(scale, scale, scale);
    }

    show() {
        this.entity.enabled = true;
    }
    hide() {
        this.entity.enabled = false;
    }

    createEntity() {
        var obj = {
            root: null,
        };

        // root entity
        var entity = obj.root = new pc.Entity();
        entity.name = 'Gizmo';

        return obj;
    }

    createMaterial(color) {
        var mat = new pc.BasicMaterial();
        mat.color = color;
        mat.depthTest = false; //?
        if (color.a !== 1) {
            mat.blend = true;
            mat.blendSrc = pc.BLENDMODE_SRC_ALPHA;
            mat.blendDst = pc.BLENDMODE_ONE_MINUS_SRC_ALPHA;
        }
        mat.update();
        return mat;
    }
}
