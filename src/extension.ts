import * as vscode from 'vscode';

interface Snippet {
    prefix: string;
    body: string[] | string;
    description: string;
}

interface AlgoQuickPickItem extends vscode.QuickPickItem {
    snippetBody: string;
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Расширение "algo-templates" активировано!');

    const disposable = vscode.commands.registerCommand('algo-templates.insertTemplate', async () => {
        const config = vscode.workspace.getConfiguration('algo-templates');
        const snippets = config.get<{[key: string]: Snippet}>('cpp.snippets');

        if (!snippets || Object.keys(snippets).length === 0) {
            vscode.window.showInformationMessage('Шаблоны алгоритмов не найдены в настройках.');
            return;
        }

        const quickPickItems: AlgoQuickPickItem[] = Object.entries(snippets).map(([name, snippet]) => ({
            label: name,
            description: snippet.description,
            snippetBody: Array.isArray(snippet.body) ? snippet.body.join('\n') : snippet.body
        }));

        const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
            placeHolder: 'Выберите шаблон алгоритма для вставки',
        });

        if (selectedItem) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.insertSnippet(new vscode.SnippetString(selectedItem.snippetBody));
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
