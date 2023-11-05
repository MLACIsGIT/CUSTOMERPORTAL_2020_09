import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export default function UserProfile() {
  const { instance, accounts } = useMsal();
  let activeAccount;
  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const name = activeAccount?.name ?? "no data";
  const email = activeAccount?.username ?? "no data";

  function handleLogoutRedirect() {
    instance.logoutRedirect({
      account: instance.getActiveAccount(),
    });
  }

  console.log("loginRequest", loginRequest);

  return (
    <>
      <div className="d-flex flex-row mx-2 my-1">
        <div>
          name: {name} username: {email}
        </div>
        <div>
          <AuthenticatedTemplate>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogoutRedirect}
            >
              Logout
            </button>
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>Not logged in.</UnauthenticatedTemplate>
        </div>
      </div>
    </>
  );
}
