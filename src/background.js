'use strict';
import path from 'path'

let fs = require("fs");
import {
    app,
    protocol,
    BrowserWindow,
    ipcMain,
    shell,
    Menu,
} from 'electron'

import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib'

// Setup logger
// autoUpdater.logger = require('electron-log')
// autoUpdater.logger.transports.file.level = 'info'

// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}]);
ipcMain.on("update", async (event, arg) => {
    shell.openExternal(arg)
});


ipcMain.on("updateVersion", async (event, arg) => {
    autoUpdater.checkForUpdates()
})


ipcMain.on("openLink", async (event, arg) => {
    shell.openExternal(arg)
})

ipcMain.on("deeplink", (event, arg) => {
    event.reply("deeplink", {deeplink})
})

let mainWindow
let deeplink;
// let appIcon = null
ipcMain.on("gradeFilter", async (event, arg) => {
    event.reply('resetGrade', arg)
})

async function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        minWidth: 1250,
        minHeight: 760,
        webPreferences: {
            devTools: true,
            webSecurity: false,
            plugins: true,
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
        },
        icon: path.join(__static, 'icon.png')
    });
    // mainWindow.setContentProtection(true)
    mainWindow.setTitle("E-SCHOOL")
    mainWindow.setMenu(null);
    Menu.setApplicationMenu(null)
    mainWindow.maximize();
    mainWindow.on("close", (event) => {
        app.quit()
    })

    if (process.platform == 'win32') {
        deeplink = process.argv.slice(1)[0]
    }
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_loadingScreen) mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        mainWindow.loadURL('app://./index.html')
    }
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        let lastElement = commandLine[commandLine.length - 1];
        if (lastElement.indexOf('e-school'))
            deeplink = lastElement

        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.show()
        }
    })
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS, it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    createWindow()
});

app.name = "E-SCHOOL"

// Trigger event 'open-url' on mac OS
app.on("open-url", (event, data) => {
    event.preventDefault();
    setTimeout(() => {
        mainWindow.webContents.send('deeplink', {deeplink: data});
    }, 3000)

});

app.setAsDefaultProtocolClient("e-school");

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}