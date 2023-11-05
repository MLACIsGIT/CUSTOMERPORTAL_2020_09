import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { EventType, PublicClientApplication } from "@azure/msal-browser";

import reportWebVitals from "./reportWebVitals";
import Basic from "./components/Basic";
import Wrapper from "./components/Wrapper";
import Template from "./components/Template";
import App from "./App";
import { msalConfig } from "./authConfig";
import UserProfile from "./components/UserProfile";
import "./index.scss";
import { SettingsProvider } from "./common/SettingsContext";

// MSAL configuration
// const configuration = {
//   auth: {
//     clientId: clientID,
//     authority: authority,
//     redirectUri: "http://localhost:3000/",
//   },
//   cache: {
//     cacheLocation: "sessionStorage", // This configures where your cache will be stored
//     storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
//   },
// };

// const pca = new PublicClientApplication(configuration);
// const pca = new PublicClientApplication(msalConfig);

const pca = await PublicClientApplication.createPublicClientApplication(
  msalConfig
);

// Default to using the first account if no account is active on page load
if (!pca.getActiveAccount() && pca.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  pca.setActiveAccount(pca.getAllAccounts()[0]);
}

// Optional - This will update account state if a user signs in from another tab or window
pca.enableAccountStorageEvents();

// Listen for sign-in event and set active account
pca.addEventCallback(
  (event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      const account = event.payload.account;
      pca.setActiveAccount(account);
    }
  },
  (err) => {
    console.error("MSAL Event Callback:", err);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <SettingsProvider>
      <MsalProvider instance={pca}>
        <p>ENV clientID: {msalConfig.auth.clientId}</p>
        <p>ENV authority: {msalConfig.auth.authority}</p>
        <UserProfile />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="basic" element={<Basic />} />
              <Route path="wrapper" element={<Wrapper />} />
              <Route path="template" element={<Template />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MsalProvider>
    </SettingsProvider>
  </React.StrictMode>
);

reportWebVitals();
