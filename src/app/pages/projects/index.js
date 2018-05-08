import './style.styl';

const fs = window.require('fs');
const path = window.require('path');
const {dialog} = window.require('electron').remote;

export default {
    template: require('./template.pug')(),
    data() {
        return {

        }
    },
    computed: {
        projects() { return this.$store.state.projects; },
        sortedProjects() {
            // сначала недавно открытые
            return this.projects.sort((a, b) => {
                return b.lastOpened - a.lastOpened;
            });
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
                    id: folder.hashCode().toString(36),
                    name: path.basename(folder),
                    path: folder,
                    scnenes: [],
                };
                this.$store.commit('addProject', project);
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
