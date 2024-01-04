import * as vscode from 'vscode';
import * as path from 'path';
import axios from 'axios';

const BASE_URL: string = "http://localhost:3000";

interface PostData {
	title: string;
	code: string;
	language: string;
	style: string;
}

interface Snippet {
	id: string;
	title: string;
	style: string;
	language: string;
	code: string;
	createdAt: string;
	editedAt: string;
}

function getSelectedText(editor: vscode.TextEditor): string | null {
	const selection = editor.selection;
	const text = editor.document.getText(selection);

	if (!text) {
		vscode.window.showErrorMessage('Nessun testo selezionato');
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

async function postSnippet(data: PostData): Promise<Snippet> {
	return await axios.post('http://localhost:9002/api/snippets/', data, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'User-Agent': 'codeishot/1.0.0',
			'X-CSRFTOKEN': 'iuB8T0Ugq7Q20taBFhFdwPazWtKTN8OgETfdnjruVVChk4TxUhJhllWYhZZv9uVC',
		}
	}).then( res => res.data)
	.catch( err => console.error(err.data || err.message));
}

async function handlePostResponse(data: Snippet) {
	if (data && data.id) {
		const snippetUrl = `${BASE_URL}/${data.id}`;
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
		if (!text) { return; };

		const postData: PostData = {
			title: getCurrentFileName() || "untitled" , 
			code: text,
			language: "python", // TODO: detect file language
			style: "androidstudio"
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
