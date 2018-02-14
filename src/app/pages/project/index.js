// import glob from 'glob';
const glob = window.require('globby');
const fs = window.require('fs');

export default {
    template: require('./template.pug')(),
    data() {
        return {
            projects: null,
            project: null,
            scenes: null,
        }
    },
    methods: {
        getProject(id) {
            if (!id) id = this.$router.currentRoute.params.id;
            return this.projects.find((v) => v.name === id);
        }
    },
    created() {
        this.projects = JSON.parse( localStorage.getItem('projects') );
        this.project = this.getProject();
        this.project.lastOpened = Date.now();
        localStorage.setItem('projects', JSON.stringify(this.projects));

        var scenes = glob.sync('**/*scene.json', {
            cwd: this.project.path,
            ignore: '**/node_modules/**',
        });
        scenes = scenes.map((v) => {
            var json = fs.readFileSync(v, 'utf8');
            return JSON.parse(json);
        });
        console.log('jsons', scenes);
    }
};
