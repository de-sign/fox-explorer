const
    fs = require('fs'),
    path = require('path');

module.exports = {
    components: {
        'content-list-item': require('./ContentListItem')
    },
    mounted() {
        this.$on('content-list-item-delete', oItem => {
            this.startLoading( () => {
                const oSubItem = Object.assign({}, this.oSubItem);
                delete oSubItem[ oItem.nId ];
                this.oSubItem = oSubItem;
                this.$root.$emit('content-list-delete', oItem);
            } );
        } );
    },

    props: {
        sPath: String
    },
    data() {
        return {
            oSubItem: {}
        };
    },
    computed: {
        aSortedSubItem() {
            console.log(this.oSubItem);
            this.endLoading();
            return Object.values(this.oSubItem).sort( (oA, oB) => {
                return oA.sType == oB.sType ?
                    oA.sName.localeCompare(oB.sName, 'fr', { numeric: true, sensitivity: 'base' } ) :
                    oA.sType == 'directory' ? -1 : 1;
            } );
        }
    },

    watch: {
        sPath(sNewPath) {
            this.startLoading( () => {
                const oSubItem = {};
                try {

                    const bErr = false,
                        aSubItem = fs.readdirSync(sNewPath);

                    aSubItem.forEach( (sName) => {
                        try {
                            const sPath = path.join(sNewPath, sName),
                                oStat = fs.statSync(sPath);

                            oSubItem[ oStat.ino ] = {
                                nId: oStat.ino,
                                sPath: sPath,
                                sName: sName,
                                sType: oStat.isDirectory() ? 'directory' : 'file'
                            };
                        }
                        catch (oErr) {
                            bErr = true;
                            this.$root.$emit('alert-list-add', 'warning', oErr.toString());
                        }
                    } );
                    
                    if( !bErr ){
                        this.$nextTick( () => {
                            aSubItem.length ?
                                this.$root.$emit('alert-list-clean') :
                                this.$root.$emit('alert-list-add', 'info', 'No files or directories found');
                        } );
                    }

                } catch (oErr) {
                    this.$nextTick( () => this.$root.$emit('alert-list-add', 'warning', oErr.toString()) );
                }
                
                this.oSubItem = oSubItem;
            } );
        }
    },

    methods: {
        // Waiting
        startLoading(fCallback) {
            document.body.classList.add('fe-waiting');
            setTimeout( fCallback, 10 );
        },

        endLoading() {
            this.$nextTick( () => document.body.classList.remove('fe-waiting') );
        }
    },

    template: `
        <div>
            <content-list-item
                v-for="oFile in aSortedSubItem"
                :key="oFile.nId"
                :s-path="oFile.sPath"
            ></content-list-item>
        </div>
    `
};