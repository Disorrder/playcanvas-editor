import './style.styl';

export default {
    template: require('./template.pug')(),
    data() {
        return {
            qq: 'QQ'
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
    mounted() {
        this.initApp();
        this.initScene();
    }
};

// utils
function serializeEntity(entity) {

}

function deserializeEntity(entity, data) {

}
