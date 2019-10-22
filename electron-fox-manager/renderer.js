module.exports = function(electron){

    // Ajout des PROP et METHOD communs ...
    const efm = require('./share')(electron);

    // Ajout des PROP et METHOD du processus RENDERER
    return Object.assign(efm, {

        // Liste des Modules
            // Gestionnaire des BrowserWindow
        windows: {

            oInstance: {},

            // Initilisation du module
            initialize() {
                return new Promise( (fResolve, fReject) => {
                    // UPDATE du gestionnaire lors de modificaton de BrowserWindow via MAIN
                    efm.ipcRenderer.on('efm-window-update', (oEvent, oMap) => {
                        fResolve();
                        efm.windows.update(oMap);
                    });
                    // Demande de l'INIT du gestonnaire via MAIN
                    efm.ipcRenderer.send('efm-window-init-renderer');
                } );
            },
            // CREATE d'un BrowserWindow
            create(sName, sUrl = null, oOptions = {}) {
                if( !this[sName] ){
                    this[sName] = this.oInstance[sName] = new electron.BrowserWindow(oOptions);
                    sUrl && this[sName].loadURL(sUrl);
                    this[sName].on('closed', () => this.destroy(sName));
                    efm.ipcRenderer.send('efm-window-create-from-renderer', sName, this[sName].id);
                    return this[sName];
                }
            },
            // UPDATE du gestonnaire via MAIN
            update(oMap) {
                let sName = null;
                // Récupération des BrowserWindow inconnu
                for( sName in oMap ){
                    if( !this[sName] ){
                        this[sName] = this.oInstance[sName] = efm.remote.BrowserWindow.fromId( oMap[sName] );
                    }
                }
                // Suppression des BrowserWindow inexistant
                for( sName in this.oInstance ){
                    if( !oMap[sName] ){
                        delete this[sName];
                        delete this.oInstance[sName];
                    }
                }
            },
            // DESTROY d'un BrowserWindow
            destroy(sName) {
                efm.ipcRenderer.send('efm-window-destroy-from-renderer', sName);
            }
        },

        // Liste des Méthodes
        initialize() {
            const aPromise = [];

            // INIT des Modules
            aPromise.push( efm.windows.initialize() );

            return Promise.all(aPromise);
        }

    });
};
