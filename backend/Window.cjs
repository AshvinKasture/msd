const { BrowserWindow, Menu, screen, dialog, app } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');

class WindowHandler {
  static mainWindow;
  constructor({ isDev, appName }) {
    this.appName = appName;
    this.navData = {
      currentFilePath: null,
      currentWindow: null,
    };
    this.window = new BrowserWindow({
      title: this.appName,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.cjs'),
      },
    });
    if (app.isPackaged) {
      this.window.loadFile(path.join(__dirname, 'build', 'index.html'));
    } else {
      this.window.loadURL('http://localhost:3000');
    }
    this.window.maximize();
    this.createMenu();
    if (isDev) {
      this.devSetup();
    }
  }

  createMenu() {
    const menu = [
      {
        label: 'Developer',
        submenu: [
          {
            label: 'Open App Directory',
            click: () => {
              exec(`explorer ${app.getPath('userData')}`);
            },
          },
          {
            label: 'Console',
            click: () => {
              this.window.openDevTools();
            },
          },
        ],
      },
    ];
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
  }

  devSetup() {
    setTimeout(() => {
      const allScreens = screen.getAllDisplays();
      if (allScreens.length === 3) {
        const [
          {
            bounds: { x: x1, y: y1 },
          },
          monitor2,
          {
            bounds: { x: x3, y: y3 },
          },
        ] = allScreens;
        this.window.setPosition(x1, y1);
        this.window;
        this.devTools = new BrowserWindow();
        this.window.webContents.setDevToolsWebContents(
          this.devTools.webContents
        );
        this.window.webContents.openDevTools({ mode: 'detach' });
        this.devTools.setPosition(1913, 147);
        this.devTools.setSize(526, 735);
        // this.window.show(); // Maybe useful
      }
    }, 200);
  }

  changePage(pageName) {
    this.window.webContents.send('PAGE', pageName);
  }

  showDialogBox({
    title = this.appName,
    message = 'This is a dialog box',
    type = 'info',
    buttons = ['OK'],
    noLink = true,
  }) {
    const selectedIndex = dialog.showMessageBoxSync(this.window, {
      title,
      message,
      type,
      buttons,
      noLink,
    });
    return selectedIndex;
  }

  showInfoBox({ message }) {
    return this.showDialogBox({ message });
  }

  showConfirmationBox({ message }) {
    return this.showDialogBox({
      message,
      type: 'question',
      buttons: ['OK', 'Cancel'],
    });
  }

  showErrorBox({ message }) {
    return this.showDialogBox({
      title: 'Error',
      message,
      type: 'error',
    });
  }

  openFile({ title, buttonLabel }) {
    const filePath = dialog.showOpenDialogSync(this.window, {
      title,
      buttonLabel,
    });
    return filePath || [];
  }

  async printPage() {
    console.log('printing');
    const data = await this.window.webContents.printToPDF({
      // printBackground: true,
      pageSize: 'A4',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });
    const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf');
    fs.writeFile(pdfPath, data, (error) => console.error(error));
  }
}

module.exports = WindowHandler;
