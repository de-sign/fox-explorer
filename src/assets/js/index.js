const
    fs = require('fs'),
    path = require('path'),
    efm = require('../electron-fox-manager/_');
    
let oVue = null;

efm.initialize().then( () => {

    oVue = new Vue({
        el: '.fe-wrap',
        
        components: {
            'alert-list': require('./components/AlertList'),
            'content-menu': require('./components/ContentMenu'),
            'content-list': require('./components/ContentList'),
            'current-directory-nav': require('./components/CurrentDirectoryNav'),
            'window-control': require('./components/WindowControl')
        },
        
        mounted() {
            this.$on('current-directory-nav-open', sPath => this.openItem('directory', sPath) );
            this.$on('content-list-item-open', (sType, sPath) => this.openItem(sType, sPath) );
            this.$on('content-list-item-rename', (sOldPath, sNewPath) => this.renameItem(sOldPath, sNewPath) );
            this.$on('content-list-item-move', oItem => this.moveItem(oItem) );
            this.$on('content-list-delete', sPath => this.deleteItem(sPath) );
            this.$on('content-menu-create', sType => this.createItem(sType) );
            
            this.sCurrentPath = efm.remote.app.getAppPath('home');
        },
        updated() {
            this.$nextTick( () => document.body.classList.remove('fe-loading') );
        },
        
        data: {
            sCurrentPath: ''
        },
        
        methods: {

            // Create Item
            createItem(sType) {
                if( sType == 'directory' ){
                    let sName = '',
                        sPath = '',
                        nIndex = 0;

                    do {
                        sName = 'New directory' + (nIndex ? ' ' + nIndex : '');
                        sPath = path.join(this.sCurrentPath, sName);
                        nIndex++;
                    } while( fs.existsSync(sPath) );
                    fs.mkdirSync(sPath);
                    this.$emit('app-create', sName);
                }
                
                else {
                    console.log('TODO create file');
                }
            },

            // Open Item
            openItem(sType, sPath) {
                sType == 'directory' ?
                    this.sCurrentPath = sPath :
                    efm.shell.openItem(sPath);
            },
    
            // Rename Item
            renameItem(sOldPath, sNewPath) {
                try {
                    fs.renameSync(sOldPath, sNewPath);
                } catch( oErr ) {
                    this.$emit('alert-list-add', 'warning', oErr.toString());
                }
            },
    
            // Move Item
            moveItem(oItem) {
                console.log('TODO move');
            },
    
            // Delete Item
            deleteItem(sPath) {
                efm.shell.moveItemToTrash(sPath);
            }
        }
    } );
} );