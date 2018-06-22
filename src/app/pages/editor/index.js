import './style.styl';
import './components';

const fs = window.require('fs');
const path = window.require('path');

import ScriptType from 'app/extensions/ScriptType';
import {serializeScene, deserializeScene} from 'app/extensions/serialize';
import MouseController from './modules/MouseController';
import Gizmo from './modules/Gizmo';
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
            scripts: [],

            // scene
            needUpdate: false,

            activeCamera: null,
            cameras: {},
            gizmo: null,
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
        editorRoot() { return this.app.root.findByPath('Editor Root'); },
        sceneRoot() { return this.app.root.findByPath('Root'); },

        selected() {
            return this.$store.state.editor.selected;
        },
        selectedCenter() {
            if (!this.selected.length) return null;
            if (!this._selectedCenter) this._selectedCenter = new pc.Vec3();
            this._selectedCenter.copy( this.selected[0].getPosition() );
            return this._selectedCenter;
        }
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
            var data = serializeScene(this.app, this.sceneRoot);
            // temp
            data.name = this.sceneJson.name;
            data.settings = this.sceneJson.settings;
            // end temp
            this.writeSceneFile(data);
        },
        playScene() {
            var projectId = this.project.id;
            var sceneId = this.scene.id;
            this.$router.push({name: 'player', projectId, sceneId})
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
            this.updateGizmo();
        },

        deselectEntity(entity) {
            this.$store.commit('editor/deselectOne', entity);
            this.$refs.rightDock.opened = !!this.selected.length;
            this.updateGizmo();
        },

        deselectAll() {
            this.$store.commit('editor/deselectAll');
            this.$refs.rightDock.opened = !!this.selected.length;
            this.updateGizmo();
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

            this.initPicker();
            this.initGizmo();
            this.initCamera();
        },

        initGizmo() {
            let gizmo = new Gizmo();
            gizmo.activate('translate');
            this.editorRoot.addChild(gizmo);
            this.gizmo = gizmo;
            this.updateGizmo();
        },
        updateGizmo() {
            if (this.selected.length) {
                let entity = this.selected[0];
                this.gizmo.setPosition(entity.getPosition());
                this.gizmo.setEulerAngles(entity.getEulerAngles());
                this.gizmo.enabled = true;
            } else {
                this.gizmo.enabled = false;
            }
        },

        initCamera() {
            var camera = new Camera(this.app);
            camera.setPosition(0, 0, 12); // TODO: read pos and rot from LS
            this.editorRoot.addChild(camera);
            this.cameras.perspective = camera;

            // set active
            this.activeCamera = this.cameras.perspective;
            this.picker.camera = this.activeCamera; // потом при переключении камеры нужно устанавливать её в пикер
        },

        initPicker() {
            this.picker = new MouseController();
        },

        initScene() {
            var data = window.require(this.sceneFilePath);
            this.sceneJson = data;

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
            this.updateScripts();
        },

        mapScripts(items) {
            return items.map((v) => {
                return {
                    path: v,
                    fullPath: path.join(this.project.path, v),
                    // fileName: path
                };
            });
        },
        updateScripts() {
            var data = this.sceneJson;
            if (!data.settings.priority_scripts) return;
            this.scripts = this.mapScripts(data.settings.priority_scripts);
            this.scripts.forEach((v) => {
                window.require(v.fullPath);
            });
            this.sceneRoot.find((v) => {
                if (v.script) {
                    v.script._scriptsData = data.entities[v._guid].components.script.scripts;
                    v.script._scriptsData.forEach((script) => {
                        if (script.useInEditor) v.script.create(script.name, script);
                    });
                }
            });
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
        this.app.destroy();
        [].concat(Object.values(this.cameras), this.gizmo, this.picker).forEach((v) => {
            if (v.detachEvents) v.detachEvents();
        });
    },
    mounted() {
        this.initApp();
        this.initEditorNodes();
        this.initScene();
        this.attachEvents();

        $(this.$refs.leftDock.$el).on('click', '.pc-entity-item', (e) => {
            var el = e.currentTarget.parentNode;
            var entity = el.__vue__.entity;
            this.selectEntity(entity);
        });
    }
};
