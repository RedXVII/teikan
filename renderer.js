const ipc = require('electron').ipcRenderer

ipc.on('open-image', (event, path) => {
  document.getElementById('main-img').src = path
})
