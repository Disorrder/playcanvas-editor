// copied from official editor
/* editor/gizmo/gizmo-translate.js */

import GizmoBase from './GizmoBase';

const GIZMO_MASK = 8;
const arrowRadius = .4;

var dv = new pc.Vec3(); // delta vector
var projection = new pc.Vec3();
var vecA = new pc.Vec3();

export default class GizmoTranslate extends GizmoBase {
    constructor() {
        super('Gizmo Translate');
        this.entities = this.createEntity();
        this.entity = this.entities.root;
    }

    attachEvents() {
        // super.attachEvents();
        this._app.on('picker:leave', this.onLeave, this);
        this._app.on('picker:hover', this.onHover, this);
        // this._app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        // this._app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        $(document).on('mousedown.gizmo', this.onMouseDown.bind(this));
        $(document).on('mouseup.gizmo', this.onMouseUp.bind(this));
    }

    onLeave(entity) {
        if (this.moving) return;
        if (!this.entities.hoverable.includes(entity)) return;
        this.hovered = null;
        if (entity.plane) {
            entity.model.material = entity.mat;
        } else {
            let line = this.entities.line[entity.axis];
            let arrow = this.entities.arrow[entity.axis];
            arrow.model.material = arrow.mat;
        }
    }

    onHover(entity) {
        if (this.moving) return;
        if (!this.entities.hoverable.includes(entity)) return;
        this.hovered = entity;
        if (entity.plane) {
            entity.model.material = this.entities.matActiveTransparent;
        } else {
            let line = this.entities.line[entity.axis];
            let arrow = this.entities.arrow[entity.axis];
            arrow.model.material = this.entities.matActive;
        }
    }

    onMouseDown(e) {
        if (!e.onCanvas) return;
        if (this.picker.busy || this.moving) return;
        if (!this.hovered) return;
        this.moving = true;
        this.movingAxis = this.hovered.axis;
        if (this.hovered.plane) {
            this.movingNorm = this.movingAxis;
            this.movingAxis = "xyz".replace(this.movingAxis, '');
        }
        console.log('Giz: MD', e);
        this._startEvent = e;

        let point = this.getMousePosition(e.x, e.y);
        this._startDelta = new pc.Vec3().sub2(point, this.editor.selectedCenter);
        $(document).on('mousemove.gizmo', this.onMouseMove.bind(this));
    }

    onMouseUp(e) {
        if (!this.moving) return;
        this.moving = false;
        this._prevEvent = this._startEvent = null;
        console.log('Giz: MU', e);
        $(document).off('mousemove.gizmo');
    }

    onMouseMove(e) {
        // if (!this._prevEvent) this._prevEvent = this._startEvent;
        
        // let dx = e.clientX - this._prevEvent.clientX;
        // let dy = e.clientY - this._prevEvent.clientY;
        // this._prevEvent = e;

        let point = this.getMousePosition(e.x, e.y).sub(this._startDelta);
        dv.sub2(point, this.editor.selectedCenter);

        let [LMB, MMB, RMB] = this._app.mouse._buttons;
        if (!LMB) {
            this.onMouseUp(e);
            return;
        };

        // Проекция вектора на плоскость есть сумма проекций вектора на 2 прямые, лежащие в этой плоскости
        // В данном случае 2 прямые - координатные оси локального пространства объекта
        projection.set(0, 0, 0);
        this.movingAxis.split('').forEach((axis) => {
            if (axis === 'x') axis = this.parent.right;
            if (axis === 'y') axis = this.parent.up;
            if (axis === 'z') axis = this.parent.forward;
            vecA.copy(axis);
            let dot = dv.dot(vecA);
            projection.add( vecA.scale(dot) );
        });

        this.parent.translate(projection);
        this.editor.selected.forEach((v) => {
            v.translate(projection);
        });

        // console.log('Giz: MM', dv.data, e._point.data, this.movingAxis);
    }

    getMousePosition(x, y) {
        // поскольку координаты мыши не совпадают с центром гизмо, вычисляем глубину клика
        // как проекцию расстояния от камеры до гизмо на направление взгляда камеры.
        vecA.copy(this.editor.selectedCenter).sub( this.editor.activeCamera.getPosition() );
        let dot = vecA.dot(this.editor.activeCamera.forward);
        return this.editor.activeCamera.camera.screenToWorld(x, y, dot);
    }

    createEntity() {
        var obj = {
            root: this,
            plane: {
                x: null,
                y: null,
                z: null
            },
            line: {
                x: null,
                y: null,
                z: null
            },
            arrow: {
                x: null,
                y: null,
                z: null
            },
            hoverable: [ ],
            matActive: null,
            matActiveTransparent: null
        };

        // active mat
        obj.matActive = this.createMaterial(new pc.Color(1, 1, 1, 1));
        obj.matActiveTransparent = this.createMaterial(new pc.Color(1, 1, 1, .25));
        obj.matActiveTransparent.cull = pc.CULLFACE_NONE;

        // root entity
        var entity = this;

        // var gizmoLayer = pc.LAYERID_UI;
        var gizmoLayer = pc.LAYERID_IMMEDIATE;

        // plane x
        var planeX = obj.plane.x = new pc.Entity();
        planeX.name = "planeX";
        obj.hoverable.push(planeX);
        planeX.axis = 'x';
        planeX.plane = true;
        planeX.addComponent('model', {
            type: 'plane',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        planeX.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(planeX);
        planeX.setLocalEulerAngles(90, -90, 0);
        planeX.setLocalScale(.8, .8, .8);
        planeX.setLocalPosition(0, .4, .4);
        planeX.mat = planeX.model.material = this.createMaterial(new pc.Color(1, 0, 0, .25));
        planeX.mat.cull = pc.CULLFACE_NONE;

        // plane y
        var planeY = obj.plane.y = new pc.Entity();
        planeY.name = "planeY";
        obj.hoverable.push(planeY);
        planeY.axis = 'y';
        planeY.plane = true;
        planeY.addComponent('model', {
            type: 'plane',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        planeY.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(planeY);
        planeY.setLocalEulerAngles(0, 0, 0);
        planeY.setLocalScale(.8, .8, .8);
        planeY.setLocalPosition(-.4, 0, .4);
        planeY.mat = planeY.model.material = this.createMaterial(new pc.Color(0, 1, 0, .25));
        planeY.mat.cull = pc.CULLFACE_NONE;

        // plane z
        var planeZ = obj.plane.z = new pc.Entity();
        planeZ.name = "planeZ";
        obj.hoverable.push(planeZ);
        planeZ.axis = 'z';
        planeZ.plane = true;
        planeZ.addComponent('model', {
            type: 'plane',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        planeZ.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(planeZ);
        planeZ.setLocalEulerAngles(90, 0, 0);
        planeZ.setLocalScale(.8, .8, .8);
        planeZ.setLocalPosition(-.4, .4, 0);
        planeZ.mat = planeZ.model.material = this.createMaterial(new pc.Color(0, 0, 1, .25));
        planeZ.mat.cull = pc.CULLFACE_NONE;

        // line x
        var lineX = obj.line.x = new pc.Entity();
        lineX.name = "lineX";
        obj.hoverable.push(lineX);
        lineX.axis = 'x';
        lineX.addComponent('model', {
            type: 'cylinder',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        lineX.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(lineX);
        lineX.setLocalEulerAngles(90, 90, 0);
        lineX.setLocalPosition(1.6, 0, 0);
        lineX.setLocalScale(arrowRadius, .8, arrowRadius);
        lineX.mat = lineX.model.material = this.createMaterial(new pc.Color(1, 0, 0, 0));

        // line y
        var lineY = obj.line.y = new pc.Entity();
        lineY.name = "lineY";
        obj.hoverable.push(lineY);
        lineY.axis = 'y';
        lineY.addComponent('model', {
            type: 'cylinder',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        lineY.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(lineY);
        lineY.setLocalEulerAngles(0, 0, 0);
        lineY.setLocalPosition(0, 1.6, 0);
        lineY.setLocalScale(arrowRadius, .8, arrowRadius);
        lineY.mat = lineY.model.material = this.createMaterial(new pc.Color(0, 1, 0, 0));

        // line z
        var lineZ = obj.line.z = new pc.Entity();
        lineZ.name = "lineZ";
        obj.hoverable.push(lineZ);
        lineZ.axis = 'z';
        lineZ.addComponent('model', {
            type: 'cylinder',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        lineZ.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(lineZ);
        lineZ.setLocalEulerAngles(90, 0, 0);
        lineZ.setLocalPosition(0, 0, 1.6);
        lineZ.setLocalScale(arrowRadius, .8, arrowRadius);
        lineZ.mat = lineZ.model.material = this.createMaterial(new pc.Color(0, 0, 1, 0));

        // arrow x
        var arrowX = obj.arrow.x = new pc.Entity();
        arrowX.name = "arrowX";
        obj.hoverable.push(arrowX);
        arrowX.axis = 'x';
        arrowX.addComponent('model', {
            type: 'cone',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        arrowX.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(arrowX);
        arrowX.setLocalEulerAngles(90, 90, 0);
        arrowX.setLocalPosition(2.3, 0, 0);
        arrowX.setLocalScale(arrowRadius, .6, arrowRadius);
        arrowX.mat = arrowX.model.material = this.createMaterial(new pc.Color(1, 0, 0, 1));

        // arrow y
        var arrowY = obj.arrow.y = new pc.Entity();
        arrowY.name = "arrowY";
        obj.hoverable.push(arrowY);
        arrowY.axis = 'y';
        arrowY.addComponent('model', {
            type: 'cone',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        arrowY.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(arrowY);
        arrowY.setLocalEulerAngles(0, 0, 0);
        arrowY.setLocalPosition(0, 2.3, 0);
        arrowY.setLocalScale(arrowRadius, .6, arrowRadius);
        arrowY.mat = arrowY.model.material = this.createMaterial(new pc.Color(0, 1, 0, 1));

        // arrow z
        var arrowZ = obj.arrow.z = new pc.Entity();
        arrowZ.name = "arrowZ";
        obj.hoverable.push(arrowZ);
        arrowZ.axis = 'z';
        arrowZ.addComponent('model', {
            type: 'cone',
            castShadows: false,
            receiveShadows: false,
            castShadowsLightmap: false,
            layers: [gizmoLayer]
        });
        arrowZ.model.model.meshInstances[0].mask = GIZMO_MASK;
        entity.addChild(arrowZ);
        arrowZ.setLocalEulerAngles(90, 0, 0);
        arrowZ.setLocalPosition(0, 0, 2.3);
        arrowZ.setLocalScale(arrowRadius, .6, arrowRadius);
        arrowZ.mat = arrowZ.model.material = this.createMaterial(new pc.Color(0, 0, 1, 1));

        return obj;
    }
}
