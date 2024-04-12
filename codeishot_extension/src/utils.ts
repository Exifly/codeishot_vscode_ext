import {
  workspace,
  window,
  type WorkspaceConfiguration,
  ConfigurationTarget,
} from "vscode";
import { exit } from "process";

/**
 * @returns Extension configuration Object
 */
function useConfig(): WorkspaceConfiguration {
  let config = workspace.getConfiguration();
  if (!config) {
    window.showErrorMessage("Some error occurred with the configuration!");
    exit(1);
  }

  return config;
}

function updateUserConfiguration(token: string) {
  workspace.getConfiguration().update("jwt", token, ConfigurationTarget.Global);
}

function getTokenFromConfiguration(): string {
  let config = workspace.getConfiguration();
  if (!config) {
    window.showErrorMessage("Some error occured with Configuration!");
    exit(1);
  }

  let token: string | undefined = config.get("jwt");
  if (!token || token === undefined) {
    window.showErrorMessage("Error fetching the JWT from the configuration!");
    exit(1);
  }

  return token;
}

export { useConfig, updateUserConfiguration, getTokenFromConfiguration };
