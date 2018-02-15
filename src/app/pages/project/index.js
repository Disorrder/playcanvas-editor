// import glob from 'glob';
const glob = window.require('globby');
const fs = window.require('fs');

export default {
    props: [],
    template: require('./template.pug')(),
    data() {
        return {
            project: null,
            scenes: null,
        }
    },
    computed: {
        projects() { return this.$parent.projects; },
    },
    methods: {
        getProject(id) {
            if (!id) id = this.$router.currentRoute.params.id;
            return this.projects.find((v) => v.id === id);
        },
        selectScene(item) {
            this.$router.push({name: 'editor', params: {project: this.project.id, scene: item.id}});
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

            var json = fs.readFileSync(v, 'utf8');
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
        console.log('json', this.project);
    }
};
