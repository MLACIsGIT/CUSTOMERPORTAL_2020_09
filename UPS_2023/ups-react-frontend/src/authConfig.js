import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MSAL_SPA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_MSAL_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_MSAL_REDIRECT_URI,
    // redirectUri: "http://localhost:3000/",
    // postLogoutRedirectUri: "http://localhost:3000/login",
    clientCapabilities: ["CP1"],
  },
  cache: {
    // cacheLocation: "localStorage",
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            // console.info(message);
            return;
          case LogLevel.Verbose:
            // console.debug(message);
            return;
          case LogLevel.Warning:
            // console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  apiSelData: {
    endpoint: `${process.env.REACT_APP_WEB_API_BASE_URL}/api/seldata`,
    scopes: {
      // read: [ "api://Enter_the_Web_Api_Application_Id_Here/Todolist.Read" ],
      // write: [ "api://Enter_the_Web_Api_Application_Id_Here/Todolist.ReadWrite" ]
      read: [
        `api://${process.env.REACT_APP_MSAL_WEB_API_APPLICATION_ID}/SelData.Read`,
      ],
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [
    ...protectedResources.apiSelData.scopes.read,
    // ...protectedResources.apiTodoList.scopes.write,
  ],
};
