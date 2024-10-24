const { app, ipcMain, BrowserWindow } = require('electron')

let mainWindow, page = "jqx", dir = `${__dirname}/${page}.html`
let defOptions = {
    width: 210,
    height: 165,
    frame: false,
    transparent: true,
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

