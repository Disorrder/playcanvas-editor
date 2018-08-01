const gizmoSize = .4;

var vecA = new pc.Vec3();

export default class GizmoBase extends pc.Entity {
    constructor(name, app) {
        super(name, app)

        this.picker = this.editor.picker;
        this.hovered = null;

        this.attachEvents();
        this.editor.needUpdate = true;
    }

    get editor() { return this._app._editor; }

    get moving() { return this._moving; }
    set moving(val) {
        this._moving = val;
        this.picker.busy = val ? 'gizmo' : null;
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
