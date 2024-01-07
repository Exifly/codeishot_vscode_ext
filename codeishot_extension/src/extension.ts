import * as vscode from 'vscode';
import * as path from 'path';
import axios from 'axios';

const UI_BASE_URL: string = process.env.UI_BASE_URL || 'https://codeishot.com';
const API_BASE_URL: string = process.env.API_BASE_URL || 'https://api.codeishot.com';
// const csrfToken = process.env.CSRF_TOKEN;

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
    vscode.window.showErrorMessage('No text selected');
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

async function postSnippet(data: PostData): Promise<Snippet> {
  return await axios
    .post(API_BASE_URL + '/api/snippets/', data, {
      headers: {
        accept: 'application/json',
        contentType: 'application/json',
        userAgent: 'codeishot/1.0.0',
        // 'X-CSRFTOKEN': csrfToken,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      switch (error.response.status) {
        case 400:
          // TODO: Handle if status is 400 AND some other check, not only lanuage
          vscode.window.showWarningMessage('This language is not available, sending snippet as a Plain Text');
          const newRes = postSnippetWithValidatedData(data);
          return newRes;
        case 429:
          vscode.window.showErrorMessage('Too many requests!');
          break;
        default:
          vscode.window.showErrorMessage(`CODEISHOT_ERROR: ${error}`);
          break;
      }
      vscode.window.showWarningMessage('Please try again!');
    });
}

async function postSnippetWithValidatedData(data: PostData): Promise<Snippet> {
  let plainTextData: PostData = { ...data };
  plainTextData.language = "plaintext";

  return await axios
    .post(API_BASE_URL + '/api/snippets/', plainTextData, {
      headers: {
        accept: 'application/json',
        contentType: 'application/json',
        userAgent: 'codeishot/1.0.0',
      },
    })
    .then((res) => res.data)
    .catch(() => {
      vscode.window.showWarningMessage('Please try again!');
    });
}

async function handlePostResponse(data: Snippet) {
  if (data && data.id) {
    const snippetUrl = `${UI_BASE_URL}/${data.id}`;
    try {
      await vscode.env.clipboard.writeText(snippetUrl);
      vscode.window.showInformationMessage('URL copied to clipboard');
    } catch (error) {
      vscode.window.showErrorMessage('Error copying URL: ' + error);
    }

    const infoMessage = await vscode.window.showInformationMessage(snippetUrl, 'Open URL');
    if (infoMessage === 'Open URL') {
      vscode.env.openExternal(vscode.Uri.parse(snippetUrl));
    }
  }
}

function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.postSnippet', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No editor found');
      return;
    }

    const text = getSelectedText(editor);
    if (!text) {
      return;
    }

    const postData: PostData = {
      title: getCurrentFileName() || 'untitled',
      code: text,
      language: getLanguageIdentifier() || 'python',
      style: 'androidstudio',
    };

    try {
      const data = await postSnippet(postData);
      await handlePostResponse(data);
    } catch (error: any) {
      vscode.window.showErrorMessage('Error: ' + error.message);
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() { }

export { activate, deactivate };