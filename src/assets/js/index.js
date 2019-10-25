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
            aSubFiles: []
        },
    
        computed: {
            
            oCurrentDirectory() {
                return {
                    sPath: this.sCurrentPath,
                    sName: path.basename(this.sCurrentPath),
                    sDirectory: path.dirname(this.sCurrentPath),
                    aDirectory: path.dirname(this.sCurrentPath).split(path.sep)
                };
            },

            aSortedSubFiles() {
                this._endLoading();
                return [...this.aSubFiles].sort( (oA, oB) => {
                    return oA.sType == oB.sType ?
                        oA.sName.localeCompare(oB.sName, 'fr', { numeric: true, sensitivity: 'base' } ) :
                        oA.sType == 'directory' ? -1 : 1;
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
                                sDirectory: this.sCurrentPath,
                                sName: sFile,
                                sPath: path.join(this.sCurrentPath, sFile),

                                sType: oStat.isDirectory() ? 'directory' : 'file',
                                sIcon: oStat.isDirectory() ? 'folder' : 'file-text',

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
    
            // Open File
            openFile(oFile) {
                oFile.sType == 'directory' ?
                    this._startLoading( () => this.sCurrentPath = oFile.sPath ) :
                    efm.shell.openItem(oFile.sPath);
            },
            
            openParentDirectory(nParent) {
                let aSufPath = [this.sCurrentPath];
                aSufPath.length = nParent + 1;
                this._startLoading( () => {
                    this.sCurrentPath = path.join.apply(path, aSufPath.fill('..', 1))
                } );
            },
    
            // Rename File
            renameFile(oFile) {
                console.log('TODO rename');
            },
    
            // Move File
            moveFile(oFile) {
                console.log('TODO move');
            },
    
            // Delete File
            deleteFile(oFile) {
                this._startLoading( () => {
                    efm.shell.moveItemToTrash(oFile.sPath);
                    this.aSubFiles.splice( this.aSubFiles.indexOf(oFile), 1 );
                } );
            }
        }
    } );
} );