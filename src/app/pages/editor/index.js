import './style.styl';

const fs = window.require('fs');
const path = window.require('path');

export default {
    template: require('./template.pug')(),
    data() {
        return {
            // scene: '',
        }
    },
    computed: {
        projects() { return this.$parent.projects; },
        project() {
            var id = this.$route.params.projectId;
            return this.projects.find((v) => v.id === id);
        },
        scene() {
            var id = this.$route.params.sceneId;
            return this.project.scenes.find((v) => v.id === id);
        },
        sceneFilePath() {
            return path.join(this.project.path, this.scene.path);
        }
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

        _initScene() {
            var app = this.app;
            // this.app.root.name = 'Root';

            var data = this.readSceneFile();
            data = JSON.parse(data);
            console.log(data, this.app.root);
            deserializeEntity(data.root, this.app.root);
        },

        initScene() {
            var app = this.app;
            this.app.root.name = 'Root';

            var editorRoot = new pc.Entity('Editor Root');
            app.root.addChild(editorRoot);
            var sceneRoot = new pc.Entity('Root');
            app.root.addChild(sceneRoot);

            // editor
            var camera = new pc.Entity('Perspective');
            camera.addComponent('camera', {
                clearColor: new pc.Color(0.1, 0.1, 0.1)
            });
            camera.setPosition(0, 0, 3);
            editorRoot.addChild(camera);

            // scene
            var light = new pc.Entity('light');
            light.addComponent('light');
            light.setEulerAngles(45, 0, 0);
            sceneRoot.addChild(light);

            var cube = new pc.Entity('cube');
            cube.addComponent('model', {type: 'box'});
            sceneRoot.addChild(cube);

            // register a global update event
            app.on('update', function (dt) {
                cube.rotate(10 * dt, 20 * dt, 30 * dt);
            });
        },
        readSceneFile() {
            return fs.readFileSync(this.sceneFilePath, 'utf8');
        },
        writeSceneFile(data) {
            // console.log(data, JSON.stringify(data, null, 4));
            return fs.writeFileSync(this.sceneFilePath, JSON.stringify(data, null, 2), 'utf8');
        },
    },
    created() {
        // this.project = this.$parent.projects.find((v) => v.name === this.$route.params.project);
    },
    mounted() {
        this.initApp();
        this.initScene();

        console.log('SCEN obj', this.app, this.app.scene);
        var data = {
            name: this.scene.name,
            scene: serializeScene(this.app.scene),
            root: serializeEntity(this.app.root),
        };
        this.writeSceneFile(data);

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

function deserializeEntity(data, entity) {
    if (!entity) entity = new pc.Entity();

    ['_guid', 'enabled', 'name'].forEach((v) => {
        if (v in data) entity[v] = data[v];
    });

    if ('position' in data) entity.setLocalPosition(data.position);
    if ('rotation' in data) entity.setEulerAngles(data.rotation);
    if ('scale' in data) entity.setLocalScale(data.scale);
    if ('tags' in data) entity.tags._list = data.tags;

    if ('children' in data) {
        data.children.forEach((v) => {
            entity.addChild( deserializeEntity(v) );
        });
    }

    return entity;
}

function deserializeScene() {

}
