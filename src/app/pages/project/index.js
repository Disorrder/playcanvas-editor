const glob = window.require('globby');
const fs = window.require('fs');
const path = window.require('path');

export default {
    template: require('./template.pug')(),
    data() {
        return {
            project: null,
            scenes: null,
        }
    },
    computed: {
        projects() { return this.$root.projects; },
    },
    methods: {
        getProject(id) {
            if (!id) id = this.$route.params.id;
            return this.projects.find((v) => v.id === id);
        },
        selectScene(item) {
            this.$router.push({name: 'editor', params: {projectId: this.project.id, sceneId: item.id}});
        }
    },
    created() {
        this.project = this.getProject();
        this.project.lastOpened = Date.now();

        var scenes = glob.sync('**/*scene.json', {
            cwd: this.project.path,
            ignore: '**/node_modules/**',
        });

        this.project.scenes = scenes.map((v) => {
            var id = v.hashCode().toString(36);
            var fullPath = path.join(this.project.path, v);
            var json = fs.readFileSync(fullPath, 'utf8');
            json = JSON.parse(json);
            if (!json.name) json.name = 'Untitled';

            return {
                id,
                projectId: this.project.id,
                name: json.name,
                path: v,
            };
        });
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }
};
