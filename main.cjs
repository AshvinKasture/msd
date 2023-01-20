const { app } = require('electron');
const BusinessLayer = require('./backend/BL.cjs');
const WindowHandler = require('./backend/Window.cjs');

const isDev = true;

const userDataPath = app.getPath('userData');

let windowHandler,
  logic,
  appName = 'Monthly Schedule and Dispatch';

app.whenReady().then(setup);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    setup();
  }
});

function setup() {
  windowHandler = new WindowHandler({
    isDev,
    appName,
  });
  // windowHandler.openWindow(windowCodes.HOME);
  logic = new BusinessLayer(windowHandler, userDataPath);
}
