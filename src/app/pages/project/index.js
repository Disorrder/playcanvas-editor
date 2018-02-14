// import glob from 'glob';
const glob = window.require('globby');
const fs = window.require('fs');

export default {
    props: [],
    template: require('./template.pug')(),
    data() {
        return {
            // projects: null,
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
            return this.projects.find((v) => v.name === id);
        },
        selectScene(item) {
            this.$router.push({name: 'editor', params: {project: this.project.name, scene: item.name}});
        }
    },
    created() {
        // this.projects = JSON.parse( localStorage.getItem('projects') );
        // this.project = this.getProject();
        this.project = this.projects[this.$router.currentRoute.params.id];
        this.project.lastOpened = Date.now();
        localStorage.setItem('projects', JSON.stringify(this.projects));

        var scenes = glob.sync('**/*scene.json', {
            cwd: this.project.path,
            ignore: '**/node_modules/**',
        });
        this.scenes = scenes.map((v) => {
            var json = fs.readFileSync(v, 'utf8');
            json = JSON.parse(json);
            if (!json.name) json.name = 'Untitled';
            return {
                name: json.name,
                path: v,
            };
        });
        console.log('jsons', this.scenes);
    }
};
