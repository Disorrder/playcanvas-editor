import './style.styl';
import './components';

const fs = window.require('fs');
const path = window.require('path');

import {serializeScene, deserializeScene} from 'app/extensions/serialize';
import Picker from './modules/Picker';
import GizmoTranslate from './modules/GizmoTranslate';
import Camera from './modules/Camera';

export default {
    template: require('./template.pug')(),
    data() {
        return {
            leftPanel: {
                opened: true,
            },
            rightPanel: {
                opened: false,
            },
            app: {},

            // scene
            needUpdate: false,
            activeCamera: null,

            cameras: {},
            gizmos: {},
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
        rootNode() { return console.log('com root'), this.app.root; },
        editorRoot() { return console.log('com root 1'), this.app.root.findByPath('Editor Root'); },
        sceneRoot() { return console.log('com root 2'), this.app.root.findByPath('Root'); },

        selected() {
            return this.$store.state.editor.selected;
        },
    },
    methods: {
        // --- UI ---
        readSceneFile() {
            return fs.readFileSync(this.sceneFilePath, 'utf8');
        },
        writeSceneFile(data) {
            return fs.writeFileSync(this.sceneFilePath, JSON.stringify(data, null, 2), 'utf8');
        },
        saveScene() {
            var data = serializeScene(this.app);
            this.writeSceneFile(data);
        },

        // left col
        selectEntity(entity) {
            var i = this.selected.indexOf(entity);
            if (~i) {
                this.$store.commit('editor/deselectOne', entity);
            } else {
                this.$store.commit('editor/selectOne', entity);
            }
            this.$refs.rightDock.opened = !!this.selected.length;
        },

        deselectEntity(entity) {
            this.$store.commit('editor/deselectOne', entity);
            this.$refs.rightDock.opened = !!this.selected.length;
        },

        deselectAll() {
            this.$store.commit('editor/deselectAll');
            this.$refs.rightDock.opened = !!this.selected.length;
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
            app._editor = this;

            this.app.emit = this.app.fire;

            app.start();
            // app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            app.setCanvasResolution(pc.RESOLUTION_AUTO);
            window.addEventListener('resize', function() {
                app.resizeCanvas();
            });
        },

        initEditorNodes() {
            this.app.root.name = 'Root';
            // clean up
            this.app.root.children.forEach((v) => v.destroy());

            // init service editor nodes
            this.app.root.addChild(new pc.Entity('Editor Root'));

            // cameras
            // let camera = new pc.Entity('Perspective');
            // camera.addComponent('camera', {
            //     clearColor: new pc.Color(0.1, 0.1, 0.1)
            // });
            // camera.setPosition(0, 0, 3);
            var camera = new Camera(this.app);
            this.editorRoot.addChild(camera.entity);
            this.cameras.perspective = camera;

            // set active
            this.activeCamera = this.cameras.perspective;
        },

        initPicker() {
            this.picker = new Picker(this.app);
        },

        initGizmos() {
            let gizmo = new GizmoTranslate(this.app);
            this.editorRoot.addChild(gizmo.entity);
            // gizmo.entity.setLocalPosition(0, 0, -11);
            console.log(gizmo, gizmo.entity);
            this.gizmos.translate = gizmo;

        },

        initScene() {
            var data = this.readSceneFile();
            data = JSON.parse(data);

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

        // Events
        attachEvents() {
            this.app.on('update', this.update, this);
            this.app.on('picker:select', this.selectEntity, this);
            this.app.on('picker:deselectAll', this.deselectAll, this);
        },

        onResize() {

        },

        // render loop
        update() {
            if (this.needUpdate) {
                this.needUpdate = false;
                console.log('emit editor:postUpdate');
                this.app.emit('editor:postUpdate');
            }
        }
    },
    created() {
        // this.project = this.$root.projects.find((v) => v.name === this.$route.params.project);
        this.$root.theme = 'dark';
    },
    beforeDestroy() {
        this.$root.theme = 'light';
    },
    mounted() {
        this.initApp();
        this.initEditorNodes();
        this.initScene();
        this.initPicker();
        this.initGizmos();
        this.attachEvents();

        console.log('ref rd', this.$refs.rightDock);
        $(this.$refs.leftDock.$el).on('click', '.pc-entity-item', (e) => {
            var el = e.currentTarget.parentNode;
            var entity = el.__vue__.entity;
            this.selectEntity(entity);

            console.log('lmb', el, entity);
        });
    }
};
