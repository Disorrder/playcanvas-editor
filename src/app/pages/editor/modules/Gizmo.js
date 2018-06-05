import GizmoTranslate from './GizmoTranslate';

const gizmoSize = .4;
var vecA = new pc.Vec3();

export default class Gizmo {
    constructor(app) {
        this.app = app;
        this.entity = this.createEntity();

        this.gizmos = {};
        this.currentGizmo = null;

        this.gizmos.translate = new GizmoTranslate(app);
        this.entity.addChild(this.gizmos.translate.entity);

        this.attachEvents();
        this.editor.needUpdate = true;
    }

    get editor() { return this.app._editor; }
    // get selected() { return this.app._editor.selected; }

    attachEvents() {
        this.app.on('update', this.update, this);
        // this.app.on('picker:select', this.render, this);
        this.app.on('editor:postUpdate', this.render, this);
    }
    detachEvents() { //?
        // this.app.off('editor:postUpdate', this._render);
    }

    setPosition(...vec) {
        this.entity.setLocalPosition(...vec);
        this.editor.needUpdate = true;
        // this.render(); // or set needUpdate
    }
    setRotation(...vec) {
        this.entity.setLocalEulerAngles(...vec);
        this.editor.needUpdate = true;
        // this.render(); // or set needUpdate
    }

    activate(name) {
        if (this.currentGizmo) this.currentGizmo.hide();
        var gizmo = this.gizmos[name];
        if (gizmo) gizmo.show();
        this.currentGizmo = gizmo;
    }

    update() {
        this.render();
    }

    render() {
        if (!this.entity.enabled) return;

        var pos = this.entity.getPosition();
        var camera = this.app._editor.activeCamera;
        if (!camera) return;
        camera = camera.entity;
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
        var entity = new pc.Entity();
        entity.name = 'Gizmo';
        return entity;
    }

    createMaterial(color) { //?
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
