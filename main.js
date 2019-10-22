const efm = require('./electron-fox-manager/_');

efm.initialize( {
    sUrl: `file://${__dirname}/src/index.html`,
    oWindowOptions: {
        width: 800,
        height: 600,
        minWidth: 320,
        center: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    }
} )
.then( () => efm.windows.main.maximize() );