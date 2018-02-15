import './style.styl';

const fs = window.require('fs');

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
            var id = this.$router.currentRoute.params.projectId;
            return this.projects.find((v) => v.id === id);
        },
        scene() {
            var id = this.$router.currentRoute.params.sceneId;
            return this.project.scenes.find((v) => v.id === id);
        },
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
            // this.app.root.name = 'Root';

            var editorRoot = new pc.Entity('EditorRoot');
            app.root.addChild(editorRoot);
            var sceneRoot = new pc.Entity('SceneRoot');
            app.root.addChild(sceneRoot);

            // editor
            var camera = new pc.Entity('camera');
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
    },
    created() {
        // this.project = this.$parent.projects.find((v) => v.name === this.$router.currentRoute.params.project);
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
        // console.log(data, JSON.stringify(data, null, 4));
        fs.writeFileSync(this.scene.path, JSON.stringify(data, null, 4), 'utf8');
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
