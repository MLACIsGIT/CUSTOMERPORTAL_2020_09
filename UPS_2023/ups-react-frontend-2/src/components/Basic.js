import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export default function Basic() {
  const isAuthenticated = useIsAuthenticated();

  function LoginElement() {
    const { instance, accounts, inProgress } = useMsal();

    const handleLoginRedirect = () => {
      instance
        .loginRedirect(loginRequest)
        .catch((error) => console.log("Login error:", error));
    };

    if (accounts.length > 0) {
      console.log("accounts", accounts);
      console.log(instance.getActiveAccount());
      return (
        <span>There are currently {accounts.length} users signed in!</span>
      );
    } else if (inProgress === "login") {
      return <span>Login is currently in progress!</span>;
    } else {
      return (
        <>
          <span>There are currently no users signed in!</span>
          <button
            className="btn btn-info"
            onClick={() => instance.loginPopup()}
          >
            VANILLA popup Login
          </button>
          <button className="btn btn-success" onClick={handleLoginRedirect}>
            GOOD redirect Login
          </button>
        </>
      );
    }
  }

  return (
    <>
      <h2>Basic</h2>
      <p>Anyone can see this paragraph.</p>
      {isAuthenticated && <p>At least one account is signed in!</p>}
      {!isAuthenticated && <p>No users are signed in!</p>}
      <LoginElement />
    </>
  );
}
