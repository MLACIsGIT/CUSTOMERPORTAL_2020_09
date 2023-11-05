import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import WebCallButton from "./WebCallButton";

export default function Wrapper() {
  return (
    <>
      <h2>Wrapper</h2>
      <p>Anyone can see this paragraph.</p>
      <AuthenticatedTemplate>
        <p>At least one account is signed in!</p>
        <WebCallButton />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>No users are signed in!</p>
      </UnauthenticatedTemplate>
    </>
  );
}
