
var electron = require('electron')
const ipcMain = require('electron').ipcMain
const BrowserWindow = require('electron').BrowserWindow

ipcMain.on('capture', function(e) {

    var win = BrowserWindow.fromId(e.sender.webContents.id)
    var bound = win.getBounds()
    win.capturePage({
        x: 0,
        y: 0,
        width: bound.width,
        height: bound.height
    }, (image)=> {
        e.sender.send('show-capture', image.toDataURL())
    })
})