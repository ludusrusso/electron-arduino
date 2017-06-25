import {app, BrowserWindow} from 'electron'

app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
});
