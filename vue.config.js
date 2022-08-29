module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: 'http://localhost:8080',
        overlay: {
            warnings: true,
            errors: false
        }
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                "appId": "com.e-school-cambodia.com",
                "productName": "E-SCHOOL",
                "protocols": {
                    "name": "e-school-protocol",
                    "schemes": [
                        "e-school"
                    ]
                },
                "copyright": "Copyright ©2021 E-School Cambodia",
                "publish": {
                    "provider": "github",
                    "owner": "channvuthy271",
                    "host": "github.com",
                    "protocol": "https",
                    "releaseType": "release",
                },
                "mac": {
                    "category": "public.app-category.education",
                    "target": ["pkg"],
                    "icon": "build/icons/icon.icns",
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
                    "icon": "build/icons/icon.ico"
                },
                "linux": {
                    "target": "deb"
                }
            }
        }
    }
};