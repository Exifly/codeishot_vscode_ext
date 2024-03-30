import * as vscode from "vscode";
import * as path from "path";
import { login } from "./login";
import { createSnippet } from "./services/codeishotServices";

const UI_BASE_URL: string = process.env.UI_BASE_URL || "https://codeishot.com";

interface PostData {
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

function getSelectedText(editor: vscode.TextEditor): string | null {
  const selection = editor.selection;
  const text = editor.document.getText(selection);

  if (!text) {
    vscode.window.showErrorMessage("No text selected");
    return null;
  }

  return text;
}

function getCurrentFileName(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const fullPath = document.fileName;
    return path.basename(fullPath);
  }
  return null;
}

function getLanguageIdentifier(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const languageId = editor.document.languageId;
    return languageId;
  }
  return null;
}

function checkCreateSnippetStatusCode(status: number, data: PostData) {
  switch (status) {
    case 400:
      vscode.window.showWarningMessage(
        "This language is not available, sending snippet as a Plain Text"
      );
      const newRes = postSnippetWithValidatedData(data);
      return newRes;
    case 429:
      vscode.window.showErrorMessage("Too many requests!");
      break;
    default:
      break;
  }
}

async function postSnippet(data: PostData): Promise<Snippet> {
  let res = await createSnippet(data);
  if (res.status_code) checkCreateSnippetStatusCode(res.status_code, data);
  return res.data as Promise<Snippet>;
}

async function postSnippetWithValidatedData(data: PostData): Promise<Snippet> {
  let plainTextData: PostData = { ...data };
  plainTextData.language = "plaintext";

  return await createSnippet(plainTextData)
    .then((res) => res.data)
    .catch(() => {
      vscode.window.showWarningMessage("Please try again!");
    });
}

async function handlePostResponse(data: Snippet) {
  if (data && data.id) {
    const snippetUrl = `${UI_BASE_URL}/${data.id}`;
    try {
      await vscode.env.clipboard.writeText(snippetUrl);
      vscode.window.showInformationMessage("URL copied to clipboard");
    } catch (error) {
      vscode.window.showErrorMessage("Error copying URL: " + error);
    }

    const infoMessage = await vscode.window.showInformationMessage(
      snippetUrl,
      "Open URL"
    );
    if (infoMessage === "Open URL") {
      vscode.env.openExternal(vscode.Uri.parse(snippetUrl));
    }
  }
}

function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.postSnippet",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No editor found");
        return;
      }

      const text = getSelectedText(editor);
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
        vscode.window.showErrorMessage("Error: " + error.message);
      }
    }
  );

  const loginCommand = vscode.commands.registerCommand(
    "extension.login",
    () => {
      login();
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(loginCommand);
}

function deactivate() {}

export { activate, deactivate };
