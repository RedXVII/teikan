const electron = require('electron')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app

const path = require('path')
const url = require('url')

let template = [{
  label: 'File',
  submenu: [{
    label: 'Open',
    accelerator: 'CmdOrCtrl+O',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            {name: 'Images', extensions: ['jpg', 'png', 'gif']},
            {name: 'All Files', extensions: ['*']}
          ]
        }, function (files) {
          if (files) {
            focusedWindow.webContents.send('open-image', url.format({
              pathname: files[0],
              protocol: 'file:',
              slashes: true
            }))
          }
        })
      }
    }
  }, {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    role: 'quit'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        // on reload, start fresh and close any old
        // open secondary windows
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(function (win) {
            if (win.id > 1) {
              win.close()
            }
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }]
}]


app.on('ready', function () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})
