const
    fs = require('fs'),
    path = require('path'),
    efm = require('../electron-fox-manager/_');
    
let oVue = null;

efm.initialize().then( () => {

    oVue = new Vue({
        el: '.fe-wrap',
        
        components: {
            'fe-file': require('./components/fe-file')
        },
        
        mounted: function () {
            this.$nextTick(() => {
                document.body.classList.remove('fe-loading');
            });
        },
        
        data: {
            sCurrentPath: efm.remote.app.getAppPath('home'),
            bMaximized: true,
            dDateForUpdate: Date.now(),
    
            oAlert: {
                bShow: false,
                sType: '',
                sText: '',
                sIcon: ''
            },
        
            oStructureFile: {
                aTime: [
                    { sLabel: 'Created on', sField: 'sCreated' },
                    { sLabel: 'Modify the', sField: 'sModify' }
                ],
                aMenu: [
                    { sLabel: 'Open', sIcon: 'album', sTextColor: 'primary', click: (oFile) => oVue._fileEvent_open(oFile) },
                    { sLabel: 'Rename', sIcon: 'pencil', click: (oFile) => oVue._fileEvent_rename(oFile) },
                    { sLabel: 'Move', sIcon: 'move', click: (oFile) => oVue._fileEvent_move(oFile) },
                    { sLabel: 'Delete', sIcon: 'trash', sTextColor: 'danger', click: (oFile) => oVue._fileEvent_delete(oFile) }
                ]
            }
        },
    
        computed: {
            
            oFolder: function() {
                return {
                    sPath: this.sCurrentPath,
                    sName: path.basename(this.sCurrentPath),
                    aPaths: path.dirname(this.sCurrentPath).split(path.sep)
                };
            },
            
            aSubFiles: function() {
                const aSubFile = [];
                this.dDateForUpdate; // For Force Update
    
                try {
                    fs.readdirSync(this.sCurrentPath).forEach( (sFile) => {
                        const oStat = fs.statSync( path.join(this.sCurrentPath, sFile) );
    
                        aSubFile.push( {
                            nId: oStat.uid,
                            sType: oStat.isDirectory() ? 'Directory' : 'File',
                            sIcon: oStat.isDirectory() ? 'folder' : 'file-text',
                            sPath: this.sCurrentPath,
                            sName: sFile,
                            sCreated: oStat.birthtime.toDateString() + ', ' + oStat.birthtime.toTimeString().replace(/\(.+?\)/g, ''),
                            sModify: oStat.mtime.toDateString() + ', ' + oStat.mtime.toTimeString().replace(/\(.+?\)/g, '')
                        } );
                    } );
                    
                    aSubFile.length ?
                        this._hideAlert() :
                        this._showInformation('No files or directories found');
                }
    
                catch (oErr) {
                    this._showError(oErr.toString());
                }
    
                aSubFile.sort( (oA, oB) => {
                    if( oA.sType == oB.sType ){
                        return oA.sName.localeCompare(oB.sName, 'fr', { numeric: true, sensitivity: 'base' } );
                    }
                    return oA.sType == 'Directory' ? -1 : 1;
                } );
                
                this.$nextTick(() => document.body.classList.remove('fe-waiting'));
                return aSubFile;
            }
        },
        
        methods: {
    
            // Control
            useWindowControl: function(sAction){
                efm.windows.main[sAction]();
                if( sAction == 'maximize' || sAction == 'unmaximize' ){
                    this.bMaximized = efm.windows.main.isMaximized();
                }
            },
    
            // Alert
            _showError: function(sText){
                this.oAlert = { bShow: true, sIcon: 'warning', sType: 'danger', sText: sText };
            },
    
            _showInformation: function(sText){
                this.oAlert = { bShow: true, sIcon: 'info', sType: 'primary', sText: sText };
            },
    
            _hideAlert: function(){
                this.oAlert = { bShow: false, sType: '', sText: '', sIcon: '' };
            },
    
            // File Event
            _fileEvent_open: function(oFile){
                this.openFile(oFile.sType, oFile.sName);
            },
    
            _fileEvent_rename: function(oFile){
                this.openFile(oFile.sType, oFile.sName);
            },
            
            _fileEvent_move: function(oFile){
                this.openFile(oFile.sType, oFile.sName);
            },
            
            _fileEvent_delete: function(oFile){
                this._deleteFile(path.join(oFile.sPath, oFile.sName));
            },
    
            // Open File
            openFile: function(sType, sSufPath){
                return this['_open' + sType](sSufPath);
            },
            
            _openDirectory: function(sSufPath){
                document.body.classList.add('fe-waiting');
                setTimeout( () => this.sCurrentPath = path.join(this.oFolder.sPath, sSufPath), 10);
            },
            
            _openParentDirectory: function(nParent){
                let aSufPath = [];
                aSufPath.length = nParent;
                this._openDirectory(aSufPath.fill('..').join(path.sep));
            },
            
            _openFile: function(sSufPath){
                efm.shell.openItem( path.join(this.oFolder.sPath, sSufPath) );
            },
    
            // Rename File
    
            // Move File
    
            // Delete File
            _deleteFile: function(sPath){
                document.body.classList.add('fe-waiting');
                efm.shell.moveItemToTrash(sPath);
                setTimeout( () => this.dDateForUpdate = Date.now(), 10);
            }
        }
    } );
} );