/**
 * Here is defined everything related to a snippet, its logic, data types, and implementations.
 */

import { createSnippet } from "./services/codeishotServices";
import { window, env, Uri, type TextEditor } from "vscode";
import { UI_BASE_URL } from "./config";
import path = require("path");

export interface PostData {
  title: string;
  code: string;
  style: string;
  language: string;
}

interface Snippet {
  id: string;
  title: string;
  language: string;
  style: string;
  code: string;
  createdAt: string;
  editedAt: string;
}

/**
 * Get the selected buffer text
 * @param editor
 * @returns the text selected
 */
export function getSelectedText(editor: TextEditor): string | null {
  const selection = editor.selection;
  const text = editor.document.getText(selection);

  if (!text) {
    window.showErrorMessage("No text selected");
    return null;
  }

  return text;
}

export function getCurrentFileName(): string | null {
  const editor = window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const fullPath = document.fileName;
    return path.basename(fullPath);
  }
  return null;
}

/**
 * Retrieve the tile type token identifier on the opened buffer
 * @returns the language token used on the file opened
 */
export function getLanguageIdentifier(): string | null {
  const editor = window.activeTextEditor;
  if (editor) {
    const languageId = editor.document.languageId;
    return languageId;
  }
  return null;
}

export async function postSnippet(data: PostData): Promise<Snippet> {
  let res = await createSnippet(data);
  if (res.status_code) checkCreateSnippetStatusCode(res.status_code, data);
  return res.data as Promise<Snippet>;
}

export async function postSnippetWithValidatedData(
  data: PostData
): Promise<Snippet> {
  let plainTextData: PostData = { ...data };
  plainTextData.language = "plaintext";

  return await createSnippet(plainTextData)
    .then((res) => res.data)
    .catch(() => {
      window.showWarningMessage("Please try again!");
    });
}

/**
 * Handles the POST snippet creation response to spawn the message box with
 * url info
 * @param data
 */
export async function handlePostResponse(data: Snippet) {
  if (data && data.id) {
    const snippetUrl = `${UI_BASE_URL}/${data.id}`;
    try {
      await env.clipboard.writeText(snippetUrl);
      window.showInformationMessage("URL copied to clipboard");
    } catch (error) {
      window.showErrorMessage("Error copying URL: " + error);
    }

    const infoMessage = await window.showInformationMessage(
      snippetUrl,
      "Open URL"
    );
    if (infoMessage === "Open URL") {
      env.openExternal(Uri.parse(snippetUrl));
    }
  }
}

export function checkCreateSnippetStatusCode(status: number, data: PostData) {
  switch (status) {
    case 400:
      window.showWarningMessage(
        "This language is not available, sending snippet as a Plain Text"
      );
      const newRes = postSnippetWithValidatedData(data);
      return newRes;
    case 429:
      window.showErrorMessage("Too many requests!");
      break;
    default:
      break;
  }
}
