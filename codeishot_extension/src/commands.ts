/**
 * This file is a TypeScript module for a Visual Studio Code extension.
 * It imports various components from the VS Code API and other custom modules.
 * It defines two commands: one for logging in and another for creating a code snippet.
 * The createSnippetCommand retrieves the selected text from the editor, creates a snippet
 * object with metadata, posts it to a server, and handles the response.
 */

import { commands, window, type Disposable } from "vscode";
import {
  getSelectedText,
  getCurrentFileName,
  getLanguageIdentifier,
  type PostData,
  postSnippet,
  handlePostResponse,
} from "./snippets";
import { login } from "./login";

export const loginCommand: Disposable = commands.registerCommand(
  "extension.login",
  () => {
    login();
  }
);

/**
 * Defines a command called "extension.postSnippet" in a Visual Studio Code extension.
 * When executed, it retrieves the currently active text editor, checks if there is text selected,
 * constructs a snippet object with metadata like title, code, language, and style,
 * then posts this data to a server asynchronously. If successful, it handles the response;
 * otherwise, it shows an error message.
 */
export const createSnippetCommand: Disposable = commands.registerCommand(
  "extension.postSnippet",
  async () => {
    const editor = window.activeTextEditor;
    if (!editor) {
      window.showErrorMessage("No editor found");
      return;
    }

    const text = getSelectedText(editor); // get the selected buffer text
    if (!text) {
      return;
    }

    const postData: PostData = {
      title: getCurrentFileName() || "untitled",
      code: text,
      language: getLanguageIdentifier() || "python",
      style: "androidstudio",
    };

    try {
      const data = await postSnippet(postData);
      await handlePostResponse(data);
    } catch (error: any) {
      window.showErrorMessage("Error: " + error.message);
    }
  }
);
