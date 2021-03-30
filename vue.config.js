module.exports = {
    lintOnSave: true,
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
                    "token":"0be5711f8255e99370fc465ae1a6305ae811b10c",
                   "releaseType":"release",
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