export default {
    template: require('./template.pug')(),
    data() {
        return {
            project: {}
        }
    },
    methods: {
        getProject(id) {
            if (!id) id = this.$router.currentRoute.params.id;
            var projects = JSON.parse( localStorage.getItem('projects') );
            return projects.find((v) => v.name === id);
        }
    },
    created() {
        this.project = this.getProject();
        console.log('CREATED', this.project);
    }
};
