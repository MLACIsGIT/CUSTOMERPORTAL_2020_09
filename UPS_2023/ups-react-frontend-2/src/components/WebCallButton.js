import { InteractionType } from "@azure/msal-browser";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { loginRequest, protectedResources } from "../authConfig";
import useFetchWithMsal from "../webApi/useFetchWithMsal";
import { useEffect } from "react";

export default function WebCallButton() {
  const { instance } = useMsal();
  const { error, execute } = useFetchWithMsal({
    scopes: protectedResources.apiSelData.scopes.read,
  });

  let activeAccount;
  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  // console.log("accounts-before useMsalAuthentication", accounts);
  // console.log("activeAccount-before useMsalAuthentication", activeAccount);
  // const {
  //   acquireToken,
  //   result,
  //   error: msalError,
  // } = useMsalAuthentication(InteractionType.Redirect, {
  //   // ...msalRequest,
  //   scopes: protectedResources.apiSelData.scopes.read,
  //   account: activeAccount,
  //   redirectUri: process.env.REACT_APP_MSAL_REDIRECT_URI,
  // });

  // useEffect(() => {
  //   if (!result) {
  //     console.log("USEEFFECT");
  //     acquireToken(InteractionType.Popup, loginRequest).then((ress) => {
  //       console.log(ress);
  //     });
  //   }
  // }, [error]);

  // console.log("useMsalAuthentication result", result);
  // console.log("activeAccount-AFTER useMsalAuthentication", activeAccount);
  // console.log("activeAccount-ERROR useMsalAuthentication", msalError);

  function handleWebCall() {
    console.log("Starting handleWebCall");
    execute("GET", "http://localhost:4200/api/seldata").then((result) => {
      console.log("call result", result);
    });
  }

  return (
    <>
      <div className="">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleWebCall}
        >
          Make a web call
        </button>
      </div>
    </>
  );
}
