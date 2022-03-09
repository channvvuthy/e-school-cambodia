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
                    "target": ["pkg"]
                },
                "mas": {
                    "hardenedRuntime": false,
                    "provisioningProfile": "build/embedded.provisionprofile",
                    "entitlements": "build/entitlements.mas.plist",
                    "entitlementsInherit": "build/entitlements.mas.inherit.plist",
                    "gatekeeperAssess": false,
                    "asarUnpack": [],
                    "type": "distribution"
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
            }
        }
    }
};