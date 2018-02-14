import './style.styl';

const fs = window.require('fs');

export default {
    template: require('./template.pug')(),
    data() {
        return {
            path: '',
        }
    },
    computed: {
        projects() { return this.$parent.projects; },
    },
    methods: {
        initApp() {
            var canvas = document.getElementById('canvas-3d');
            var app = new pc.Application(canvas, {});
            this.app = app;

            app.start();
            // app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            app.setCanvasResolution(pc.RESOLUTION_AUTO);
            window.addEventListener('resize', function() {
                app.resizeCanvas();
            });
        },

        initScene() {
            var app = this.app;

            var editorNode = new pc.Entity('Editor');
            app.root.addChild(editorNode);
            var sceneNode = new pc.Entity('Scene');
            app.root.addChild(sceneNode);

            // editor
            var camera = new pc.Entity('camera');
            camera.addComponent('camera', {
                clearColor: new pc.Color(0.1, 0.1, 0.1)
            });
            camera.setPosition(0, 0, 3);
            editorNode.addChild(camera);

            // scene
            var light = new pc.Entity('light');
            light.addComponent('light');
            light.setEulerAngles(45, 0, 0);
            sceneNode.addChild(light);

            var cube = new pc.Entity('cube');
            cube.addComponent('model', {type: 'box'});
            sceneNode.addChild(cube);

            // register a global update event
            app.on('update', function (dt) {
                cube.rotate(10 * dt, 20 * dt, 30 * dt);
            });
        },
    },
    created() {
        this.project = this.$parent.projects.find((v) => v.name === this.$router.currentRoute.params.project);
    },
    mounted() {
        this.initApp();
        this.initScene();

        setTimeout(() => {
            console.log('SCEN obj', this.app, this.app.scene);
            var data = {
                name: '',
                path: '',
                scene: serializeScene(this.app.scene),
                root: serializeEntity(this.app.root),
            };
            console.log(data, JSON.stringify(data, null, 4));
            
        })

    }
};

// utils
function serializeScene(scene) {
    var data = {

    };

    return data;
}

function serializeEntity(entity) {
    var data = {
        _guid: entity.guid,
        enabled: entity.enabled,
        name: entity.name,
        position: entity.getLocalPosition().toObject(),
        rotation: entity.getEulerAngles().toObject(),
        scale: entity.getLocalScale().toObject(),
    };

    if (entity.tags.size) {
        data.tags = entity.tags._list;
    }

    if (entity.children.length) {
        data.children = entity.children.map(serializeEntity);
    }

    return data;
}

function deserializeEntity(entity, data) {

}
