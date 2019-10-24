const
    fs = require('fs'),
    path = require('path'),
    efm = require('../electron-fox-manager/_');
    
let oVue = null;

efm.initialize().then( () => {

    oVue = new Vue({
        el: '.fe-wrap',
        
        components: {
            'fe-alert': require('./components/fe-alert'),
            'fe-file': require('./components/fe-file')
        },
        
        mounted() {
            this.sCurrentPath = efm.remote.app.getAppPath('home');
        },
        updated() {
            this.$nextTick( () => document.body.classList.remove('fe-loading') );
        },
        
        data: {
            bMaximized: true,
            sCurrentPath: '',
            aSubFiles: [],
            
            oStructureFile: {
                aTime: [
                    { sLabel: 'Created on', sField: 'sCreated' },
                    { sLabel: 'Modify the', sField: 'sModify' }
                ],
                aMenu: [
                    { sLabel: 'Open', sIcon: 'album', sTextColor: 'primary', click: (oFile) => oVue.openFile(oFile.sType, oFile.sName) },
                    { sLabel: 'Rename', sIcon: 'pencil', click: (oFile) => oVue._fileEvent_rename(oFile) },
                    { sLabel: 'Move', sIcon: 'move', click: (oFile) => oVue._fileEvent_move(oFile) },
                    { sLabel: 'Delete', sIcon: 'trash', sTextColor: 'danger', click: (oFile) => oVue._deleteFile(oFile) }
                ]
            }
        },
    
        computed: {
            
            oFolder() {
                return {
                    sPath: this.sCurrentPath,
                    sName: path.basename(this.sCurrentPath),
                    aPaths: path.dirname(this.sCurrentPath).split(path.sep)
                };
            },

            aSortedSubFiles() {
                this._endLoading();
                return [...this.aSubFiles].sort( (oA, oB) => {
                    return oA.sType == oB.sType ?
                        oA.sName.localeCompare(oB.sName, 'fr', { numeric: true, sensitivity: 'base' } ) :
                        oA.sType == 'Directory' ? -1 : 1;
                } );
            },
        },

        watch: {
            sCurrentPath(sNewPath, sOldPath) {
                const aSubFile = [];
                try {

                    const aErr = [];
                    fs.readdirSync(this.sCurrentPath).forEach( (sFile) => {
                        try {
                            const oStat = fs.statSync( path.join(this.sCurrentPath, sFile) );
                            aSubFile.push( {
                                nId: oStat.ino,
                                sType: oStat.isDirectory() ? 'Directory' : 'File',
                                sIcon: oStat.isDirectory() ? 'folder' : 'file-text',
                                sPath: this.sCurrentPath,
                                sName: sFile,
                                sCreated: oStat.birthtime.toDateString() + ', ' + oStat.birthtime.toTimeString().replace(/\(.+?\)/g, ''),
                                sModify: oStat.mtime.toDateString() + ', ' + oStat.mtime.toTimeString().replace(/\(.+?\)/g, '')
                            } );
                        } catch (oErr) {
                            aErr.push( oErr.toString() );
                        }
                    } );
                    
                    this.$nextTick( () => {
                        if( aErr.length ){
                            this.$refs.oAlert.show('warning', aErr.join('<br/>'));
                        } else {
                            aSubFile.length ?
                                this.$refs.oAlert.hide() :
                                this.$refs.oAlert.show('info', 'No files or directories found');
                        }
                    } );

                } catch (oErr) {
                    this.$nextTick( () => this.$refs.oAlert.show('warning', oErr.toString()) );
                }
                
                this.aSubFiles = aSubFile;
            }
        },
        
        methods: {

            // Loading
            _startLoading(fCallback) {
                document.body.classList.add('fe-waiting');
                setTimeout( fCallback, 10 );
            },

            _endLoading() {
                this.$nextTick( () => document.body.classList.remove('fe-waiting') );
            },
    
            // Control
            useWindowControl(sAction) {
                efm.windows.main[sAction]();
                if( sAction == 'maximize' || sAction == 'unmaximize' ){
                    this.bMaximized = efm.windows.main.isMaximized();
                }
            },
    
            // File Event
            _fileEvent_rename(oFile) {
                this.openFile(oFile.sType, oFile.sName);
            },
            
            _fileEvent_move(oFile) {
                this.openFile(oFile.sType, oFile.sName);
            },
    
            // Open File
            openFile(sType, sSufPath) {
                return this['_open' + sType](sSufPath);
            },
            
            _openDirectory(sSufPath) {
                this._startLoading( () => this.sCurrentPath = path.join(this.oFolder.sPath, sSufPath) );
            },
            
            _openParentDirectory(nParent) {
                let aSufPath = [];
                aSufPath.length = nParent;
                this._openDirectory(aSufPath.fill('..').join(path.sep));
            },
            
            _openFile(sSufPath) {
                efm.shell.openItem( path.join(this.oFolder.sPath, sSufPath) );
            },
    
            // Rename File
    
            // Move File
    
            // Delete File
            _deleteFile(oFile) {
                this._startLoading( () => {
                    efm.shell.moveItemToTrash(path.join(oFile.sPath, oFile.sName));
                    this.aSubFiles.splice( this.aSubFiles.indexOf(oFile), 1 );
                } );
            }
        }
    } );
} );