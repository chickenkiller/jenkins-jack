/**
 * Provide link in "error dialog: you must select a jenkins connection to use this plugin"
 * When there are no hosts to select in the command, open settings for user to add a host.
 */

import * as vscode from 'vscode';
import { PipelineJack } from './pipelineJack';
import { PipelineSnippets } from './snippets';
import { ScriptConsoleJack } from './scriptConsoleJack';
import { BuildJack } from './buildJack';
import { Jack } from './jack';
import { isGroovy } from './utils';
import { JenkinsHostManager } from './jenkinsHostManager';
import { NodeJack } from './nodeJack';
import { JobJack } from './jobJack';

export function activate(context: vscode.ExtensionContext) {

    // Backwards compat jenkins connection settings:
    // Takes previous jenkins connection values (uri, username, password) and
    // assigns it as the first entry in the `jenkins-jack.jenkins.connections` array
    let jenkinsConfig = vscode.workspace.getConfiguration('jenkins-jack.jenkins');

    if (0 === jenkinsConfig.connections.length) {
        let conns = [
            {
                "uri": jenkinsConfig.uri,
                "username": jenkinsConfig.username,
                "password": jenkinsConfig.password,
                "active": true
            }
        ]
        vscode.workspace.getConfiguration().update('jenkins-jack.jenkins.connections', conns, vscode.ConfigurationTarget.Global);
    }

    // Register Pipeline snippet definitions.
    var pipelineSnippets = new PipelineSnippets();
    let snippetsDisposable = vscode.languages.registerCompletionItemProvider('groovy', {
        provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position,
            token: vscode.CancellationToken,
            context: vscode.CompletionContext) {
            return pipelineSnippets.completionItems;
        }
    });
    context.subscriptions.push(snippetsDisposable);

    // Initialize the Jacks and their respective commands.
    let jacks: Jack[] = [];
    jacks.push(registerJack(new PipelineJack(),        'extension.jenkins-jack.pipeline',      context));
    jacks.push(registerJack(new ScriptConsoleJack(),   'extension.jenkins-jack.scriptConsole', context));
    jacks.push(registerJack(new BuildJack(),           'extension.jenkins-jack.build',         context));
    jacks.push(registerJack(new NodeJack(),            'extension.jenkins-jack.node',          context));
    jacks.push(registerJack(new JobJack(),             'extension.jenkins-jack.job',           context));

	let jacksCommands = vscode.commands.registerCommand('extension.jenkins-jack.jacks', async () => {
        if (!isGroovy()) { return; }
        // Build up command list from all the Jacks.
        let commands: any[] = [];
        for (let j of jacks) {
            commands = commands.concat(j.getCommands());
            commands.push({label: '$(dash)'.repeat(70), description: ''});
        }

        // Add in host selection command
        commands.push({
            label: "$(settings)  Host Selection",
            description: "Select a jenkins host to connect to.",
            target: async () => await JenkinsHostManager.instance().selectConnection()
        })

        // Display full list of all commands and execute selected target.
        let result = await vscode.window.showQuickPick(commands);
        if (undefined === result || undefined === result.target) { return; }
        await result.target();
	});
    context.subscriptions.push(jacksCommands);

    console.log('Extension Jenkins Jack now active!');


    /**
     * Registers a jack command to display all sub-commands within that Jack.
     */
    function registerJack(
        jack: Jack,
        registerCommandString: string,
        context: vscode.ExtensionContext) {

        let disposable = vscode.commands.registerCommand(registerCommandString, async () => {
            if (!isGroovy()) { return; }
            try {
                await jack.displayCommands();
            } catch (err) {
                vscode.window.showWarningMessage(`Could not display ${registerCommandString} commands.`);
            }
        });
        context.subscriptions.push(disposable);
        return jack;
    }
}

export function deactivate() {}