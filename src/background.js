'use strict';
import path from 'path'
const fs = require("fs");
const ytdl = require('ytdl-core');
let {CookieMap} = require('cookiefile/http-cookiefile')
let cookieFile = new CookieMap(path.join(__static, 'cookies.txt'));
const cookies = cookieFile.toRequestHeader().replace('Cookie: ', '');
const {autoUpdater} = require('electron-updater')
const {download} = require('electron-dl');

import {
    app,
    protocol,
    BrowserWindow,
    ipcMain,
    shell,
    Tray,
    Menu
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
            win.webContents.send("downloaded", info)
        }));
    } catch (err) {
        win.webContents.send("fail", info)
        throw new Error(err);
    }
};

const opt = {
    requestOptions: {
        headers: {
            'Cookie': cookies
        }
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
    const win = BrowserWindow.getFocusedWindow();
    await download(win, url)
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




let win
// let appIcon = null
ipcMain.on("gradeFilter", async (event, arg) => {
    event.reply('resetGrade', arg)
})
let splash

// Close splash screen
ipcMain.on('splashScreen',()=>{
    splash.destroy();
});

async function createWindow() {

    // splash screen
    splash = new BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        width:'100%',
        height:'100%',
        parent:win,
        center:true,
        webPreferences: {
            devTools: true,
            webSecurity: false,
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
        },
        icon: path.join(__static, 'icon.png')
    });
    // Create the browser window.
    win = new BrowserWindow({
        minWidth: 1250,
        minHeight: 760,
        webPreferences: {
            devTools: true,
            webSecurity: false,
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
        },
        icon: path.join(__static, 'icon.png')
    });
    // win.setContentProtection(true)
    win.setTitle("E-SCHOOL")
    win.setMenu(null);
    Menu.setApplicationMenu(null)
    win.maximize();
    win.on("close", (event) => {
        win.hide()
        event.preventDefault()
    })

    splash.loadURL(process.env.WEBPACK_DEV_SERVER_URL + `#splash`)
    splash.show()
    splash.maximize();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_loadingScreen) win.webContents.openDevTools()
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) win.restore()
            win.show()
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

// app.whenReady().then(() => {
//     appIcon = new Tray(path.join(__static, 'icon.ico'))
//     const contextMenu = Menu.buildFromTemplate([
//         {
//             label: 'Exit', type: 'normal', click: () => {
//             app.exit(0)
//         }
//         },
//     ])
//     appIcon.setToolTip('E-SCHOOL')
//     appIcon.setContextMenu(contextMenu)

//     appIcon.on("click", () => {
//         win.isVisible() ? win.hide() : win.show()
//     })

// })


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


// Setup updater events
autoUpdater.on('checking-for-update', () => {
    win.webContents.send("checking-for-update")
});

autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall()
});

autoUpdater.on('err', (error) => {
    console.error(error)
})
