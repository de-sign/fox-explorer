module.exports = {

    components: {
        'alert-list-item': require('./AlertListItem')
    },
    mounted() {
        this.$root.$on('alert-list-add', (sIcon, sHtml) => this.add(sIcon, sHtml) );
        this.$root.$on('alert-list-clean', () => this.clean() );
    },

    data() {
        return {
            aAlert: []
        };
    },
    
    methods: {
        add(sIcon, sHtml) {
            this.aAlert.push( { sIcon, sHtml } );
        },
        clean() {
            this.aAlert = [];
        }
    },

    template: `
        <div v-if="aAlert.length">
            <alert-list-item
                v-for="oAlert in aAlert"
                :s-icon="oAlert.sIcon"
                :s-html="oAlert.sHtml"
            ></alert-list-item>
        </div>
    `
};