/**
 * Defines various handlers for this vscode extension.
 */

import { updateUserConfiguration, updateConfiguration } from "./utils";
import { window, Uri, type Disposable, ConfigurationTarget } from "vscode";
import { isAuthApproved } from "./preferences";

export const loginUriHandler: Disposable = window.registerUriHandler({
  handleUri(uri: Uri) {
    if (uri.path === "/login") {
      const jwtParam = uri.query.split("=")[1];
      if (jwtParam) {
        window.showInformationMessage("Logged Successfully! ✨");
        updateUserConfiguration(jwtParam);

        if (!isAuthApproved())
          updateConfiguration(
            "Authentication",
            true,
            ConfigurationTarget.Global
          );
      }
    }
  },
});
