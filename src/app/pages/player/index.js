import './style.styl';

const fs = window.require('fs');
const path = window.require('path');
import {deserializeScene} from 'app/extensions/serialize';

export default {
    template: require('./template.pug')(),
    data() {
        return {
            app: {},

        }
    },
    computed: {
        // --- UI ---
        projects() { return this.$store.state.projects; },
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
        },

        // --- 3D ---
        rootNode() { return this.app.root; },
    },
    methods: {
        // --- UI ---
        editScene() {
            var projectId = this.project.id;
            var sceneId = this.scene.id;
            this.$router.push({name: 'editor', projectId, sceneId});
        },

        // --- 3D ---
        // --- initialization ---
        initApp() {
            var canvas = document.getElementById('canvas-3d');
            var app = new pc.Application(canvas, {
                // elementInput: new pc.ElementInput(canvas),
                mouse: new pc.Mouse(canvas),
                touch: !!('ontouchstart' in window) ? new pc.TouchDevice(canvas) : null,
                keyboard: new pc.Keyboard(window),
            });
            this.app = app;

            app.start();
            // app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            app.setCanvasResolution(pc.RESOLUTION_AUTO);
            window.addEventListener('resize', function() {
                app.resizeCanvas();
            });
        },

        initScene() {
            var data = window.require(this.sceneFilePath);
            // data = JSON.parse(data);

            if (!data.settings || Object.keys(data.settings).length === 0) {
                data.settings = {
                    "physics": {
                        "gravity": [0, -9.8, 0]
                    },
                    "render": {
                        "global_ambient": [0.3, 0.3, 0.3],
                        "fog_color": [0.6, 0.6, 0.8]
                    }
                };
            }
            this.app.applySceneSettings(data.settings);

            var sceneRoot = deserializeScene(this.app, data);
            this.app.root.addChild(sceneRoot);
            console.log('initScene', data, sceneRoot);
        },
    },
    created() {
        this.$root.theme = 'dark';
    },
    beforeDestroy() {
        this.$root.theme = 'light';
    },
    mounted() {
        this.initApp();
        this.initScene();
    }
};
