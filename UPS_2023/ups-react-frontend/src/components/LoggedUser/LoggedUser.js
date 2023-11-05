import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";

import "./LoggedUser.scss";
import * as Gl from "../../common/Gl";
import langJSON from "./LoggedUser-lang";
import useSettings from "../../common/SettingsContext";

export default function LoggedUser() {
  const LangElements = langJSON();
  const { lang } = useSettings();

  const { instance } = useMsal();
  let activeAccount;
  if (instance) {
    activeAccount = instance.getActiveAccount();
    // console.log("activeAccount-LoggedUser", activeAccount);
  }

  const name = activeAccount?.name ?? "Unknown";
  const email = activeAccount?.username ?? "";

  function handleLogoutRedirect() {
    instance.logoutRedirect({
      account: instance.getActiveAccount(),
    });
  }

  function lng(key) {
    return Gl.LANG_GET_FormItem(LangElements, key, lang);
  }

  return (
    <AuthenticatedTemplate>
      <div
        id="LoggedUser"
        className="btn btn-success"
        onClick={handleLogoutRedirect}
      >
        <div id="LoggedUser-user-icon"></div>
        {lng("div-LoggedUser")}
        <span>{name}</span>
        <span>{email}</span>
      </div>
    </AuthenticatedTemplate>
  );
}
