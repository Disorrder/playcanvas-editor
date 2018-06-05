// copied from official editor
/* editor/gizmo/gizmo-translate.js */

import Gizmo from './Gizmo';

const GIZMO_MASK = 8;
const arrowRadius = .4;

var vecA = new pc.Vec3();

export default class GizmoTranslate extends Gizmo {
    constructor(app) {
        super(app);
        this.entities = this.createEntity();
        this.entity = this.entities.root;
    }

    createEntity() {
        var obj = {
            root: null,
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
        obj.matActive = createMaterial(new pc.Color(1, 1, 1, 1));
        obj.matActiveTransparent = createMaterial(new pc.Color(1, 1, 1, .25));
        obj.matActiveTransparent.cull = pc.CULLFACE_NONE;

        // root entity
        var entity = obj.root = new pc.Entity();
        entity.name = 'Translate Gizmo';
        entity.enabled = false;

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
        planeX.mat = planeX.model.material = createMaterial(new pc.Color(1, 0, 0, .25));
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
        planeY.mat = planeY.model.material = createMaterial(new pc.Color(0, 1, 0, .25));
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
        planeZ.mat = planeZ.model.material = createMaterial(new pc.Color(0, 0, 1, .25));
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
        lineX.mat = lineX.model.material = createMaterial(new pc.Color(1, 0, 0, 0));

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
        lineY.mat = lineY.model.material = createMaterial(new pc.Color(0, 1, 0, 0));

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
        lineZ.mat = lineZ.model.material = createMaterial(new pc.Color(0, 0, 1, 0));

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
        arrowX.mat = arrowX.model.material = createMaterial(new pc.Color(1, 0, 0, 1));

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
        arrowY.mat = arrowY.model.material = createMaterial(new pc.Color(0, 1, 0, 1));

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
        arrowZ.mat = arrowZ.model.material = createMaterial(new pc.Color(0, 0, 1, 1));

        return obj;
    }
}

function createMaterial(color) {
    var mat = new pc.BasicMaterial();
    mat.color = color;
    mat.depthTest = false;
    if (color.a !== 1) {
        mat.blend = true;
        mat.blendSrc = pc.BLENDMODE_SRC_ALPHA;
        mat.blendDst = pc.BLENDMODE_ONE_MINUS_SRC_ALPHA;
    }
    mat.update();
    return mat;
}
