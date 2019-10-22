const electron = require('electron');

// eslint-disable-line global-require
require('electron-squirrel-startup') && electron.app.quit(); 

// Recupère automatiquement EFM en fonction du processus MAIN ou RENDERER via type de IPC
module.exports = require(electron.ipcMain ? './main' : './renderer')(electron);