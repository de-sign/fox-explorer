const path = require('path');

module.exports = {
    props: {
        sPath: String
    },
    computed: {
        sName() {
            return path.basename(this.sPath);
        },
        aDirectory() {
            return path.dirname(this.sPath).split(path.sep);
        }
    },

    methods: {
        open(nParent) {
            let aSufPath = [this.sPath];
            aSufPath.length = this.aDirectory.length - nParent + 1;
            this.$root.$emit('current-directory-nav-open', {
                sType: 'directory',
                sPath: path.join.apply(path, aSufPath.fill('..', 1))
            } );
        }
    },
    
    template: `
        <nav>
            <h2 class="uk-margin-remove uk-h1">{{ sName }}</h2>
            <ul class="fe-app-no-drag uk-breadcrumb uk-margin-remove">
                <li v-for="(sDirectory, nIndex) in aDirectory">
                    <a href="#" @click="open(nIndex)" >{{ sDirectory }}</a>
                </li>
            </ul>
        </nav>
    `
};
                        