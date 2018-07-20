import GizmoTranslate from './GizmoTranslate';

const gizmoSize = .4;
var vecA = new pc.Vec3();
var selected;

export default class Gizmo extends pc.Entity {
    constructor(app) {
        super('Gizmo', app);

        this.gizmos = {};
        this.currentGizmo = null;

        this.gizmos.translate = new GizmoTranslate();
        this.addChild(this.gizmos.translate.entity);

        this.attachEvents();
        this.editor.needUpdate = true;

        this.watchPosition = true;
        this.watchRotation = true;
    }

    get editor() { return this._app._editor; }

    attachEvents() {
        this._app.on('update', this.update, this);
        // this._app.on('picker:select', this.render, this);
        this._app.on('editor:postUpdate', this.render, this);
    }
    detachEvents() { //?
        // this._app.off('editor:postUpdate', this._render);
        Object.values(this.gizmos).forEach((v) => {
            if (v.detachEvents) v.detachEvents();
        });
    }

    setPosition(...vec) {
        super.setPosition(...vec);
        this.editor.needUpdate = true;
    }
    setRotation(...vec) {
        super.setRotation(...vec);
        this.editor.needUpdate = true;
    }
    setEulerAngles(...vec) {
        super.setEulerAngles(...vec);
        this.editor.needUpdate = true;
    }

    activate(name) {
        if (this.currentGizmo) this.currentGizmo.hide();
        var gizmo = this.gizmos[name];
        if (gizmo) {
            gizmo.enabled = true;
        }
        this.currentGizmo = gizmo;
    }

    update() {
        if (!this.enabled) return;
        selected = this.editor.selected;
        
        if (this.editor.selected.length === 1) {
            selected = selected[0];
            if (this.watchPosition) this.setPosition(selected.getPosition());
            if (this.watchRotation) this.setRotation(selected.getRotation());
        }

        this.render();
    }

    render() {
        if (!this.enabled) return;

        var pos = this.getPosition();
        var camera = this.editor.viewportCamera;
        if (!camera) return;
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
        this.setLocalScale(scale, scale, scale);
    }


    createEntity() {
        var entity = new pc.Entity();
        entity.name = 'Gizmo';
        entity.gizmoCtrl = this;
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
