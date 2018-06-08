const gizmoSize = .4;

var vecA = new pc.Vec3();

export default class GizmoBase {
    constructor(app) {
        this.app = app;
        this.entities = this.createEntity();
        this.entity = this.entities.root;

        this.picker = app._editor.picker;
        this.hovered = null;

        this.attachEvents();
        this.app._editor.needUpdate = true;
    }

    get moving() { return this._moving; }
    set moving(val) {
        this._moving = val;
        this.picker.busy = val ? 'gizmo' : null;
    }

    attachEvents() {
        // this.app.on('editor:postUpdate', this._render = this.render.bind(this));
        // this.app.on('editor:postUpdate', this.render, this);
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
        // editor:postUpdate
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
