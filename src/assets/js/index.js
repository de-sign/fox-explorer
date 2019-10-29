const
    fs = require('fs'),
    path = require('path'),
    efm = require('../electron-fox-manager/_');
    
let oVue = null;

efm.initialize().then( () => {

    oVue = new Vue({
        el: '.fe-wrap',
        
        components: {
            'window-control': require('./components/WindowControl'),
            'current-directory-nav': require('./components/CurrentDirectoryNav'),
            'alert-list': require('./components/AlertList'),
            'content-list': require('./components/ContentList')
        },
        
        mounted() {
            this.$on(['content-list-item-open', 'current-directory-nav-open'], oItem => this.openItem(oItem) );
            this.$on('content-list-item-rename', oItem => this.renameItem(oItem) );
            this.$on('content-list-item-move', oItem => this.moveItem(oItem) );
            this.$on('content-list-delete', oItem => this.deleteItem(oItem) );
            
            this.sCurrentPath = efm.remote.app.getAppPath('home');
        },
        updated() {
            this.$nextTick( () => document.body.classList.remove('fe-loading') );
        },
        
        data: {
            sCurrentPath: ''
        },
        
        methods: {
    
            // Open Item
            openItem(oItem) {
                oItem.sType == 'directory' ?
                    this.sCurrentPath = oItem.sPath :
                    efm.shell.openItem(oItem.sPath);
            },
    
            // Rename Item
            renameItem(oItem) {
                console.log('TODO rename');
            },
    
            // Move Item
            moveItem(oItem) {
                console.log('TODO move');
            },
    
            // Delete Item
            deleteItem(oItem) {
                efm.shell.moveItemToTrash(oItem.sPath);
            }
        }
    } );
} );