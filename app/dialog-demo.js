const ipcMain = require('electron').ipcMain

var dialog = require('electron').dialog

ipcMain.on('display-dialog', function(val) {
    dialog.showMessageBox({
        message: "My Msg",
        buttons:["Save", "Cancel123", "Don't Save"],
        defaultId: 1,
        cancelId: 1,
    }, function(index, checked) {
    })
})