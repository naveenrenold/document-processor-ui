import * as msal from "@azure/msal-browser";

const msalConfig: msal.Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AppId,
    authority:
      "https://login.microsoftonline.com/" + import.meta.env.VITE_TenantId,
    redirectUri: import.meta.env.VITE_BaseURL,
  },
  cache: {
    cacheLocation: "memoryStorage",
    storeAuthStateInCookie: false,
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
  scopes: [
    "Directory.ReadWrite.All",
    "GroupMember.ReadWrite.All",
    "User.ReadWrite.All",
    "UserAuthenticationMethod.ReadWrite.All",
  ],
};

export { msalConfig, loginRequest };
