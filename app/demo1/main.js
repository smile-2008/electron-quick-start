const { app, ipcMain, BrowserWindow } = require('electron')

require('../dialog-demo')
require('../webContents-demo')

let mainWindow, page = "demo1", dir = `${__dirname}/${page}.html`
let defOptions = {
    width: 800,
    height: 600,
    frame: true,
    transparent: false,
    webPreferences: {
        webSecurity: false,
        nodeIntegration: true
        //...
    }
}


app.on('ready', () => {
    mainWindow = new BrowserWindow(defOptions)
    mainWindow.loadURL(`file://${dir}`)

    mainWindow.webContents.openDevTools()
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

