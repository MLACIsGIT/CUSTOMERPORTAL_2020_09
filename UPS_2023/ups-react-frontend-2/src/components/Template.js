import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

function ErrorComponent({ error }) {
  return <p>An Error Occurred: {error}</p>;
}

function LoadingComponent() {
  return <p>Authentication in progress...</p>;
}

export default function Wrapper() {
  const authRequest = {
    scopes: ["openid", "profile"],
  };

  return (
    <>
      <h2>Template</h2>
      {/* authenticationRequest, errorComponent and loadingComponent props are
      optional */}
      {/* <MsalAuthenticationTemplate
        // interactionType={InteractionType.Popup}
        interactionType={InteractionType.Redirect}
        authenticationRequest={authRequest}
        errorComponent={ErrorComponent}
        loadingComponent={LoadingComponent}
      >
        <p>At least one account is signed in!</p>
      </MsalAuthenticationTemplate> */}
      Disabled for now.
    </>
  );
}
