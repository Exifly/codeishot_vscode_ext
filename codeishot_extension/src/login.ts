import { exit } from "process";
import * as vscode from "vscode";
import { verifyToken } from "./services/codeishotServices";

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

export function saveToken(token: string) {
  vscode.workspace
    .getConfiguration()
    .update("jwt", token, vscode.ConfigurationTarget.Global);
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

async function openLoginBrowser() {
  // open the browser with google login and get the token
  // TODO: Change the url using .env
  vscode.env.openExternal(
    vscode.Uri.parse("http://localhost:3000/login?type=vscode")
  );
}

async function isValidToken(): Promise<boolean> {
  // @Question => is this function really useful?
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
  openLoginBrowser(); // spawn the codeishot login page
}

export { login, getTokenFromConfiguration };
