/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import *as vscode from 'vscode';

const AUTH_PROVIDER_ID = 'crafting';
const AUTH_PROVIDER_LABEL = 'crafting';

export class CraftingGithubProvider implements vscode.AuthenticationProvider {
	private readonly _onDidChangeSessions = new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	get onDidChangeSessions(): vscode.Event<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent> {
		return this._onDidChangeSessions.event;
	}

	constructor(private readonly context: vscode.ExtensionContext) {
		context.subscriptions.push(

		);
	}

}