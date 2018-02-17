import './style.styl';

const fs = window.require('fs');
const path = window.require('path');

import {serializeScene, deserializeScene} from 'app/extensions/serialize';

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

        initScene() {
            var app = this.app;

            var data = this.readSceneFile();
            data = JSON.parse(data);
            // this.app.applySceneSettings(data.settings);
            this.app.root = deserializeScene(this.app, data);
            console.log(data, this.app.root);

            // var cube = this.app.root.findByName('cube');
            // app.on('update', function (dt) {
            //     cube.rotate(10 * dt, 20 * dt, 30 * dt);
            // });
        },

        initScene_test() {
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

            // write to file
            var data = serializeScene(this.app);
            this.writeSceneFile(data);
        },
        readSceneFile() {
            return fs.readFileSync(this.sceneFilePath, 'utf8');
        },
        writeSceneFile(data) {
            return fs.writeFileSync(this.sceneFilePath, JSON.stringify(data, null, 2), 'utf8');
        },
    },
    created() {
        // this.project = this.$parent.projects.find((v) => v.name === this.$route.params.project);
    },
    mounted() {
        this.initApp();
        this.initScene();
        // this.initScene_test();

        // var cube = this.app.root.findByName('cube');
        // this.app.on('update', function (dt) {
        //     cube.rotate(10 * dt, 20 * dt, 30 * dt);
        // });
    }
};
