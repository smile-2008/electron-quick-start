const { app, ipcMain, BrowserWindow } = require('electron')

let mainWindow, page = "gallery", dir = `${__dirname}/${page}.html`
let defOptions = {
    width: 1120,
    height: 800,
    frame: false,
    transparent: false,
    webPreferences: {
        webSecurity: false,
        nodeIntegration: true
        //...
    }
}

ipcMain.on('max', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
})
ipcMain.on('min', () => {
    mainWindow.minimize();
})
ipcMain.on('close', () => {
    mainWindow.close();
})

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

