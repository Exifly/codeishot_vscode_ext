import { env, Uri } from "vscode";
import { UI_BASE_URL_LOGIN } from "./config";

async function openLoginBrowser() {
  // open the browser with google login and get the token
  env.openExternal(Uri.parse(UI_BASE_URL_LOGIN));
}

async function login() {
  openLoginBrowser(); // spawn the codeishot login page
}

export { login };
