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
            if (!this.projects) return [];
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
            this.$router.push({name: 'project', params: {id: item.id}});
        },
        deleteProject(item) {
            console.log('DEL');
            this.$store.commit('deleteProject', item);
        }
    },
    created() {

    }
};
