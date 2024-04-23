module.exports = {
    devServer: {
        port: 8080, // changing the port of the Vue dev server
        proxy: {
          '/api': { // assuming your API endpoints start with /api
            target: 'http://eschool-api.stag.ink/v5.2/', // backend server
            changeOrigin: true,
            pathRewrite: { '^/api': '' }, // might be necessary depending on your API path
          },
        },
        overlay: {
          warnings: false,
          errors: false // setting this to true to see errors in overlay
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
                    "extendInfo": {
                        "NSMicrophoneUsageDescription": "We need access to your microphone so people you talk to in a Grape Call can hear you.",
                        "NSCameraUsageDescription": "Allow your conversational partners to see you in a Grape Call. You can turn off your video anytime during a call."
                    }
                },
                "mas": {
                    "entitlements": "build/entitlements.mas.plist",
                    "entitlementsInherit": "build/entitlements.mas.inherit.plist"
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