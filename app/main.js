
// console.log(process.argv)
const subapp = process.argv[2]

require(`./${subapp}/main`)


const electron = require('electron')

const {app, Tray} = electron

app.on('ready', function() {
    const appIcon = new Tray(__dirname + '/qrcode.png');
    appIcon.on('click', () => {
        global.mainWindow.show()
    })
    var contextMenu = electron.Menu.buildFromTemplate([
        {
            label: 'Quit', type: 'normal', click() {
                app.quit()
            }
        },
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ]);
    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);
})
