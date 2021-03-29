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
                "publish":{
                    "provider":"github",
                    "token":""
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