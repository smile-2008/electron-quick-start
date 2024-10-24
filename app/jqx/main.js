const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow



// require('./gallery')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


function extend(dest, src) {
	
	for(var k in src) {
		dest[k] = src[k]
	}
}
var argv =  require("process").argv
var pageIndex = argv[1].indexOf('inspect') == -1 ? 2 : 3
var page = argv[pageIndex] || "gallery"
// var page = argv[pageIndex] || "admin"

var pageMap = {
    "textman":  "page/window",
}
var page2
if (pageMap[page]) {
    page2 = pageMap[page]
}else {
    page2 = page
}

var dirMap = {
    admin: '/develop/github/my-admin/electron/index.html'
}
var optMap = {
    jqx: {
        frame: false,
        transparent: true,
        width: 210,
        height: 165,
        x: 3,
        y: 625
    },
    textman: {
        frame: false,
        transparent: false,
        width: 550,
        height: 50,
        x: 3,
        y: 625
    },
    gallery: {
        frame: false,
        transparent: false,
        width: 800,
        height: 400,
        x: 100,
        y: 100
    }
}


var defOptions = { width: 800, height: 600, frame: true,
    frame: true, background: '#777', transparent: false,webPreferences: {
      webSecurity: false,
      nodeIntegration: true
      //...
    } }

    if (optMap[page])
    extend(defOptions, optMap[page])

var dir = dirMap[page] || `${__dirname}/${page}/${page2}.html`
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow(defOptions)
    // and load the index.html of the app.
    mainWindow.loadURL(`file://${dir}`)
    // mainWindow.loadURL(`file://${__dirname}/index.html`)

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('max', ()=> {
    mainWindow.maximize();
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.