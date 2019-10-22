module.exports = function(electron){

    // Ajout des PROP et METHOD communs ...
    const efm = require('./share')(electron);

    // Ajout des PROP et METHOD du processus MAIN
    return Object.assign(efm, {

        // Liste des Modules
            // Gestionnaire des BrowserWindow
        windows: {

            oInstance: {},
            oIdMap: {},

            // Initilisation du module
            initialize() {
                efm.onWithObject(efm.ipcMain, {
                    // INIT du gestionnaire d'un RENDERER
                    'efm-window-init-renderer': (oEvent) => oEvent.reply('efm-window-update', efm.windows.oIdMap),
                    // UPDATE du gestionnaire lors de modificaton de BrowserWindow via RENDERER
                    'efm-window-create-from-renderer': (oEvent, sName, nId) => efm.windows.createFromRenderer(sName, nId),
                    'efm-window-destroy-from-renderer': (oEvent, sName) => efm.windows.destroy(sName)
                });
                return Promise.resolve();
            },
            // CREATE d'un BrowserWindow
            create(sName, sUrl = null, oOptions = {}) {
                if( !this[sName] ){
                    this[sName] = this.oInstance[sName] = new electron.BrowserWindow(oOptions);
                    sUrl && this[sName].loadURL(sUrl);
                    this[sName].on('closed', () => this.destroy(sName));
                    this.update();
                    this.oIdMap[sName] = this[sName].id;
                    return this[sName];
                }
            },
            // Récupération d'un BrowserWindow via un RENDERER
            createFromRenderer(sName, nId) {
                if( !this[sName] ){
                    this[sName] = this.oInstance[sName] = efm.BrowserWindow.fromId(nId);
                    this.oIdMap[sName] = nId;
                    this.update();
                }
            },
            // UPDATE des gestionnaire des RENDERER
            update() {
                for( let sName in this.oIdMap ){
                    this[sName].webContents.send('efm-window-update', this.oIdMap);
                }
            },
            // DESTROY d'un BrowserWindow
            destroy(sName) {
                if( this.oInstance[sName] ){
                    delete this.oIdMap[sName];
                    delete this.oInstance[sName];
                    delete this[sName];
                    this.update();
                }
            }
        },

        // Liste des Méthodes
        initialize(oOptions) {
            const aPromise = [];

            // INIT des Modules
            aPromise.push( efm.windows.initialize() );

            // APP initialize et MAIN BrowserWindow
            aPromise.push(
                new Promise( (fResolve, fReject ) => {
                    const fCreate = () => {
                        efm.windows.create('main', oOptions.sUrl, oOptions.oWindowOptions);
                        fResolve();
                    };
                    efm.onWithObject(electron.app, {
                        'ready': fCreate,
                        'activate': fCreate,
                        'window-all-closed': () => {
                            if (process.platform !== 'darwin') {
                                efm.app.quit();
                            }
                        }
                    });
                })
            );

            return Promise.all(aPromise);
        }

    });
};
