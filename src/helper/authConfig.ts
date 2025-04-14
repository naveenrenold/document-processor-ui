import * as msal from "@azure/msal-browser";
const msalConfig: msal.Configuration = {
  auth: {
    clientId: "4111b2ad-a184-4ad5-b8b0-5830a7047e2d",
    authority:
      "https://login.microsoftonline.com/24d2489e-7bb3-4339-94a2-207bb2a75abc",
    redirectUri: "http://localhost:5173/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            console.error(message);
            return;
          case msal.LogLevel.Info:
            console.info(message);
            return;
          case msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case msal.LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

const loginRequest = {
  scopes: ["vso.code.full"],
};

export { msalConfig, loginRequest };
