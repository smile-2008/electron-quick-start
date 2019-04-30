        
      const electron = require('electron')
      let dialog = electron.remote.dialog;
      console.log(dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}));  