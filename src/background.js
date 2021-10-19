'use strict';
import path from 'path'
const fs = require("fs");
const {autoUpdater} = require('electron-updater')
const {download} = require('electron-dl');
// const log = require('electron-log');

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


import axios from "axios"

// Setup logger
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

const downloadFile = async (fileUrl, info) => {
    // Get the file name
    const fileName = info._id
    // The path of the downloaded file on our machine
    const myInstalledDir = path.join(app.getAppPath(), "..", "..", "electronjs", fileName);
    //write something to root installation folder
    let dir = path.join(app.getAppPath(), "..", "..", "electronjs");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    try {
        const response = await axios({
            method: "GET",
            url: fileUrl,
            responseType: "stream",
        });
        await response.data.pipe(fs.createWriteStream(myInstalledDir).on('finish', () => {
            info.url = path.join(app.getAppPath(), "..", "..", "electronjs");
            mainWindow.webContents.send("downloaded", info)
        }));
    } catch (err) {
        mainWindow.webContents.send("fail", info)
        throw new Error(err);
    }
};

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
ipcMain.on("saveFile", async(event, url) => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    await download(mainWindow, url)
    event.reply("fileSaved", url)
    
})

ipcMain.on("updateVersion", async (event, arg) => {
    autoUpdater.checkForUpdates()
})
ipcMain.on("downloadLocation", (event, arg) => {
    event.reply("getDownloadLocation", path.join(app.getAppPath(), "..", "..", "electronjs"))
})

ipcMain.on("download", (event, arg) => {
    
    downloadFile(arg.videoUrl, arg).catch(err => {
        event.reply("downloadFailed", arg)
        throw new Error(err);
    })
});
ipcMain.on("nextDownload", (event, arg) => {
    event.reply('nextDownload', arg)
})

ipcMain.on("removeDownload", (event, arg) => {
    let dir = path.join(app.getAppPath(), "..", "..", "electronjs", arg)
    fs.unlink(dir, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
})

ipcMain.on("openLink", async (event, arg) => {
    shell.openExternal(arg)
})

ipcMain.on("deeplink", (event, arg) =>{
    event.reply("deeplink",{deeplink})
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
        if(lastElement.indexOf('e-school'))
            deeplink = lastElement

        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.show()
        }
    })
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
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
    mainWindow.webContents.send('deeplink', {deeplink:data});
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