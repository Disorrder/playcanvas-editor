import './style.styl';

import path from 'path';
const fs = window.require('fs');
const {dialog} = window.require('electron').remote;

export default {
    template: require('./template.pug')(),
    data() {
        return {
            projects: null
        }
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
                    name: path.basename(folder),
                    path: folder,
                };
                this.projects.push(project);
                localStorage.setItem('projects', JSON.stringify(this.projects));
            }
            this.selectProject(project);
        },
        selectProject(item) {
            this.$router.push({name: 'project', params: {id: item.name}});
        },
        removeProject(item) {
            var i = this.projects.indexOf(item);
            this.projects.splice(i, 1);
            localStorage.setItem('projects', JSON.stringify(this.projects));
        }
    },
    created() {
        this.projects = JSON.parse( localStorage.getItem('projects') ) || [];
    }
};
