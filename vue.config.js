module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: 'http://localhost:8080'
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                "appId": "com.e-school-cambodia.com",
                "productName": "E-SCHOOL",
                "copyright":"Copyright ©2021 E-School Cambodia",
                "publish":{
                    "provider":"github",
                    "owner":"channvuthy271",
                    "host":"github.com",
                    "protocol":"https",
                   "releaseType":"release",
                },
                "mac":{
                    "target":["pkg"]
                },
                "win": {
                    "target": [
                        {
                            "target": "nsis",
                            "arch": [
                                "x64",
                                "ia32"
                            ]
                        }
                    ],
                    "icon":"build/icons/icon.ico"
                },
            }
        }
    }
};