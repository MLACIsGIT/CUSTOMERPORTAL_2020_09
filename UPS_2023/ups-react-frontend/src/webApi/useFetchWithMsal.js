// Documentation:
// https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/3-Authorization-II/1-call-api

// Source for code:
// https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/3-Authorization-II/1-call-api/SPA/src/hooks/useFetchWithMsal.jsx

import { useState, useCallback } from "react";

import { InteractionType } from "@azure/msal-browser";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { msalConfig, protectedResources } from "../authConfig";
// import { protectedResources } from "../authConfig";

/**
 * Custom hook to call a web API using bearer token obtained from MSAL
 * @param {PopupRequest} msalRequest
 * @returns
 */
export default function useFetchWithMsal(msalRequest) {
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const activeAccount = instance.getActiveAccount();

  // console.log("activeAccount-before useMsalAuthentication", activeAccount);
  const {
    acquireToken,
    result,
    error: msalError,
  } = useMsalAuthentication(InteractionType.Redirect, {
    ...msalRequest,
    // scopes: protectedResources.apiSelData.scopes.read,
    account: activeAccount,
    // account: null,
    // redirectUri: "/redirect",
    redirectUri: process.env.REACT_APP_MSAL_REDIRECT_URI,
  });
  // console.log("useMsalAuthentication result", result);
  // console.log("useMsalAuthentication ERROR", msalError);

  /**
   * Execute a fetch request with the given options
   * @param {string} method: GET, POST, PUT, DELETE
   * @param {String} endpoint: The endpoint to call
   * @param {Object} data: The data to send to the endpoint, if any
   * @returns JSON response
   */
  const execute = async (method, endpoint, data = null) => {
    if (msalError) {
      setError(msalError);
      return;
    }

    try {
      let accessToken;

      if (result) {
        accessToken = result.accessToken;
      } else {
        const res = await acquireToken(InteractionType.Redirect, {
          ...msalRequest,
          account: activeAccount,
          redirectUri: msalConfig.auth.redirectUri,
        });
        accessToken = res.accessToken;
      }
      let response = null;

      const headers = new Headers();
      // const bearer = `Bearer ${result.accessToken}`;
      const bearer = `Bearer ${accessToken}`;
      headers.append("Authorization", bearer);

      if (data) headers.append("Content-Type", "application/json");

      let options = {
        method: method,
        // mode: "cors",
        headers: headers,
        body: data ? JSON.stringify(data) : null,
      };

      setIsLoading(true);

      const resJSON = await fetch(endpoint, options);
      // console.log(resJSON);
      response = await resJSON.json();
      // console.log(response);
      setData(response);

      setIsLoading(false);
      return response;
    } catch (e) {
      setError(e);
      setIsLoading(false);
      throw e;
    }
  };

  async function fetchSelexpedData(body) {
    if (!body) throw new Error("Missing body!");

    if (msalError) {
      setError(msalError);
      return;
    }

    // console.log("result", result);
    try {
      let accessToken;

      if (result) {
        accessToken = result.accessToken;
      } else {
        const res = await acquireToken(InteractionType.Redirect, {
          ...msalRequest,
          account: activeAccount,
          redirectUri: msalConfig.auth.redirectUri,
        });
        accessToken = res.accessToken;
      }
      let response = null;

      const headers = new Headers();
      // const bearer = `Bearer ${result.accessToken}`;
      const bearer = `Bearer ${accessToken}`;
      headers.append("Authorization", bearer);

      if (data) headers.append("Content-Type", "application/json");

      let options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      };

      setIsLoading(true);

      const resJSON = await await fetch(
        protectedResources.apiSelData.endpoint,
        options
      );
      response = await resJSON.json();
      setData(response);

      setIsLoading(false);
      return response;
    } catch (e) {
      setError(e);
      setIsLoading(false);
      throw e;
    }
  }

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, [
      msalError,
      result,
      acquireToken,
      msalRequest,
      activeAccount,
    ]), // to avoid infinite calls when inside a `useEffect`
    fetchSelexpedData: useCallback(fetchSelexpedData, [
      msalError,
      result,
      data,
      acquireToken,
      msalRequest,
      activeAccount,
    ]),
  };
}

// export default useFetchWithMsal;
