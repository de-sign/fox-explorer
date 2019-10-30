const
    fs = require('fs'),
    path = require('path');

module.exports = {
    components: {
        'content-list-item': require('./ContentListItem')
    },
    mounted() {
        this.$root.$on('content-menu-refresh', () => this.nDate = Date.now());
        this.$root.$on('app-create', sName => this.createItem(sName));
        this.$on('content-list-item-rename', (oItem, sNewName) => this.renameItem(oItem, sNewName));
        this.$on('content-list-item-delete', oItem => this.deleteItem(oItem) );
    },

    props: {
        sPath: String
    },
    data() {
        return {
            nDate: Date.now(),
            oSubItem: {}
        };
    },
    computed: {
        aSortedSubItem() {
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
            this.update(sNewPath);
        },
        nDate() {
            this.update(this.sPath);
        }
    },

    methods: {

        startLoading(fCallback) {
            document.body.classList.add('fe-waiting');
            setTimeout( fCallback, 10 );
        },
        
        endLoading() {
            this.$nextTick( () => document.body.classList.remove('fe-waiting') );
        },

        // MAJ sans Refresh
        createItem(sName) {
            const oItem = this.create(this.sPath, sName);
            if( oItem ){
                this.startLoading( () => {
                    const oSubItem = Object.assign({}, this.oSubItem);
                    
                    oSubItem[ oItem.nId ] = oItem;
                    this.oSubItem = oSubItem;
                } );
            }
        },

        renameItem(oItem, sNewName) {
            this.startLoading( () => {
                const oSubItem = Object.assign({}, this.oSubItem),
                    sDirname = path.dirname(oItem.sPath),
                    sNewPath = path.join(sDirname, sNewName);

                oSubItem[ oItem.nId ] = Object.assign({}, oItem, {
                    sPath: sNewPath,
                    sName: sNewName
                } );
                this.oSubItem = oSubItem;
                this.$root.$emit('content-list-item-rename', oItem.sPath, sNewPath);
            } );
        },

        deleteItem(oItem) {
            this.startLoading( () => {
                const oSubItem = Object.assign({}, this.oSubItem);

                delete oSubItem[ oItem.nId ];
                this.oSubItem = oSubItem;
                this.$root.$emit('content-list-delete', oItem.sPath);
            } );
        },

        // Pour listes des ITEMS
        create(sNewPath, sName) {
            try {
                const sPath = path.join(sNewPath, sName),
                    oStat = fs.statSync(sPath);

                return {
                    nId: oStat.ino,
                    sPath: sPath,
                    sName: sName,
                    sType: oStat.isDirectory() ? 'directory' : 'file'
                };
            }
            catch (oErr) {
                this.$root.$emit('alert-list-add', 'warning', oErr.toString());
                return false;
            }
        },

        update(sNewPath) {
            this.startLoading( () => {
                const oSubItem = {};
                try {

                    const bErr = false,
                        aSubItem = fs.readdirSync(sNewPath);

                    aSubItem.forEach( (sName) => {
                        const oItem = this.create(sNewPath, sName);
                        oItem ?
                            oSubItem[ oItem.nId ] = oItem :
                            bErr = true;
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