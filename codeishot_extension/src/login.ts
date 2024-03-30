import { exit } from "process";
import * as vscode from "vscode";
import { verifyToken } from "./services/codeishotServices";

// TODO: Move this to a configuration file
const API_BASE_URL: string =
  process.env.API_BASE_URL || "https://api.codeishot.com";

function getTokenFromConfiguration(): string {
  let config = vscode.workspace.getConfiguration();
  if (!config) {
    vscode.window.showErrorMessage("Some error occured with Configuration!");
    exit(1);
  }

  let token: string | undefined = config.get("jwt");
  if (!token || token === undefined) {
    vscode.window.showErrorMessage(
      "Error fetching the JWT from the configuration!"
    );
    exit(1);
  }

  return token;
}

function saveToken(token: string) {
  vscode.workspace
    .getConfiguration()
    .update("jwt", token, vscode.ConfigurationTarget.Workspace);
}

async function getTokenFromUser(): Promise<string> {
  const searchQuery = await vscode.window.showInputBox({
    placeHolder: "ey123jhs2......",
    prompt:
      "Enter your JWT from codeishot. You can retrieve it from the browser's local storage (for now). Be careful not to share it with anyone!",
  });

  if (searchQuery === "") {
    vscode.window.showErrorMessage("You can't use a white space as JWT!");
  }

  return (searchQuery && searchQuery) || "";
}

async function getToken() {
  // open the browser with google login and get the token
}

async function isValidToken(): Promise<boolean> {
  let token = getTokenFromConfiguration();
  vscode.window.showInformationMessage(token);

  try {
    let res = await verifyToken(token);
    return res.status_code !== 401;
  } catch (error) {
    vscode.window.showErrorMessage("Error Verifying this token!");
    vscode.window.showErrorMessage(`${error}`);
    return false;
  }
}

async function login() {
  vscode.window.showInformationMessage("Login To codeishot");
  let token = await getTokenFromUser();
  if (token !== "") {
    saveToken(token);
    if (await isValidToken())
      vscode.window.showInformationMessage("Logged Successfully! ✨");
    // TODO: Configure axios interceptor instance to use this token on requests
  }
}

export { login, getTokenFromConfiguration };
