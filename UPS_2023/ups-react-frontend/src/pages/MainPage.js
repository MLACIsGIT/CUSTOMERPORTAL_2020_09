import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import PageTrack from "./Track/PageTrack";

export default function MainPage() {
  const authRequest = {
    ...loginRequest,
  };
  // console.log("authRequest", authRequest);
  // function Aaa() {
  //   return <div>Main page</div>;
  // }

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
    >
      <PageTrack />
    </MsalAuthenticationTemplate>
  );
}
