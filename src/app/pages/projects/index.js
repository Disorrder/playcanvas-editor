import './style.styl';

const fs = window.require('fs');
const path = window.require('path');
const {dialog} = window.require('electron').remote;

export default {
    template: require('./template.pug')(),
    data() {
        return {
            // projects: null
        }
    },
    computed: {
        projects() { return this.$root.projects.concat([this.$root.projects[0],this.$root.projects[0],this.$root.projects[0],this.$root.projects[0],this.$root.projects[0],this.$root.projects[0],]); },
    },
    methods: {
        createProject() {

        },
        openProject() {
            var res = dialog.showOpenDialog({properties: ['openFile', 'openDirectory']});
            if (!res) return;
            var folder = res[0];
            if (!fs.lstatSync(folder).isDirectory()) folder = path.dirname(folder);

            var project = this.projects.find((v) => v.path === folder);
            if (!project) {
                project = {
                    id: folder.hashCode().toString(36),
                    name: path.basename(folder),
                    path: folder,
                    scnenes: [],
                };
                this.projects.push(project);
                localStorage.setItem('projects', JSON.stringify(this.projects));
            }
            this.selectProject(project);
        },
        selectProject(item) {
            console.log('CLICK', item);
            // if (typeof index !== 'number') index = this.projects.indexOf(index);
            this.$router.push({name: 'project', params: {id: item.id}});
        },
        removeProject(item) {
            var i = this.projects.indexOf(item);
            this.projects.splice(i, 1);
            localStorage.setItem('projects', JSON.stringify(this.projects));
        }
    },
    created() {
        // this.projects = JSON.parse( localStorage.getItem('projects') ) || [];
        // this.$parent.projects = this.projects;
    }
};
