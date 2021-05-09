import path from "path";

const settings = {
  server: {
    host: "http://localhost",
    port: 3001,
    mediaServer: "http://161.35.6.241/api",
    bodySizeLimit: "3MB",
    allowedOrigins: [
      "127.0.0.1:3000",
      "127.0.0.1:3001",
      "127.0.0.1:3002",
      "localhost:3000",
      "localhost:3001",
      "localhost:3002"
    ]
  },
  database: {
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "ICA15033",
    database: "cadds",
    acquireTimeout: 10000
  },
  smtp: {
    host: "",
    port: 2525,
    auth: {
      user: "",
      pass: ""
    }
  },
  email: {
    default: {
      from: {
        address: "francis.gaddi@nemecistechnologies.com",
        name: "CADDS"
      }
    }
  },
  account: {
    activation: {
      enabled: true, //not in use, set here later to turn on and off,
      codeRequestIntervalInSeconds: 30
    },
    passwordReset: {
      codeRequestIntervalInSeconds: 30,
      codeValidityInHours: 4
    }
  },
  crypto: {
    salt:
      "qFBLkYJ9hI3m0gVTqch78aF19P7LEzNxUFtgUfwazRLZLvi4jFkSN61EjjyXThEVp1IJQRKPWHw4JPo830uZlTC90hk29X2QKzoctjmtPp6qlkiRd8wcjUc9OhBwICUpp2SsPByeqGsIHQNsQOy0J6oZeB23z5hX5UYo4HlVa2birjKML68xcrVXrYrJtS67aO39zvvB"
  },
  authenticationTokenName: "session-token",
  locationHeaderName: "nemecistechnologies",
  media: {
    filePath: path.dirname(require.main.filename) + "/../media",
    remotePath: "/media",
    contentTypes: {
      "image/jpeg": "jpeg",
      "image/png": "png",
      "image/gif": "gif"
    },
    serveStatic: true
  },
  cron: {
    interval: 1, // run cron every x seconds,
    databaseTypeInterval: 60 * 10,
  },
  session: {
    validity: 30 //validity in days
  }
/*   googleSignin: {
    client_id:
      "281132732900-o5qjphq9e6e13a03umm033b047klqeaf.apps.googleusercontent.com",
    project_id: "rubbiz-1563685708069",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "UWfnXPMZT0a1Uaj3a7ls-zdJ",
    redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"],
    OAuth2ClientId:
      "281132732900-o5qjphq9e6e13a03umm033b047klqeaf.apps.googleusercontent.com",
    iOSEXPOAppId:
      "281132732900-r8ba2pdtb42fdbgsd3eg8fbv2giniuke.apps.googleusercontent.com",
    AndroidEXPOAppId:
      "281132732900-u64o4mnj6vdcitj2ug1grqicbi92qmv5.apps.googleusercontent.com",
    iOSAppId:
      "281132732900-mhdout2gpgf9gudnrhjm2dj2v32sugv7.apps.googleusercontent.com",
    AndroidAppId:
      "281132732900-bngrqjlcr5npttlj3dlo1eturbpvl60n.apps.googleusercontent.com"
  },
  facebook: {
    appId: 358130328199116,
    appSecret: "93bff6137aabcb7adf28d5fb05974c63"
  }, */
};
module.exports = settings;
