/**
 * Defines various handlers for this vscode extension.
 */

import { window, Uri, type Disposable } from "vscode";
import { updateUserConfiguration } from "./utils";

export const loginUriHandler: Disposable = window.registerUriHandler({
  handleUri(uri: Uri) {
    if (uri.path === "/login") {
      const jwtParam = uri.query.split("=")[1];
      if (jwtParam) {
        window.showInformationMessage("Logged Successfully! ✨");
        updateUserConfiguration(jwtParam);
      }
    }
  },
});
