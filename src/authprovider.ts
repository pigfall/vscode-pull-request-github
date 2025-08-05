/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import *as vscode from 'vscode';
import Logger from './common/logger';
import * as fs from 'fs';

const AUTH_PROVIDER_ID = 'crafting';
const AUTH_PROVIDER_LABEL = 'crafting';
const AUTH_LOGGER_GROUP = 'crafting';

export class CraftingGithubProvider implements vscode.AuthenticationProvider {
	private readonly _onDidChangeSessions = new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	get onDidChangeSessions(): vscode.Event<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent> {
		return this._onDidChangeSessions.event;
	}

	private sessions: vscode.AuthenticationSession[] = [];

	constructor(private readonly context: vscode.ExtensionContext) {
		context.subscriptions.push(
			vscode.authentication.registerAuthenticationProvider(
				AUTH_PROVIDER_ID,
				AUTH_PROVIDER_LABEL,
				this,
				{},
			)
		);
	}

	// Impl getSessions;
	async getSessions(scopes?: string[]): Promise<vscode.AuthenticationSession[]> {
		// TODO
		return this.sessions;
	}

	// Impl createSession
	async createSession(scopes: string[]): Promise<vscode.AuthenticationSession> {
		try {
			Logger.appendLine(`creating session`, AUTH_LOGGER_GROUP);
			let token = fs.readFileSync('/var/run/sandbox/fs/secrets/owner/github_pat');
			const session: vscode.AuthenticationSession = {
				id: Date.now().toString(),
				accessToken: token.toString(),
				account: { id: 'pat-user', label: 'User' },
				scopes,
			};
			this.sessions.push(session);
			this._onDidChangeSessions.fire(
				{
					added: [session],
					removed: [],
					changed: [],
				},
			);
			return session;
		} catch (e) {
			vscode.window.showErrorMessage(`create session from github personal access token ${e}`);
			throw e;
		}
	}

	// Impl removeSession
	async removeSession(sessionId: string): Promise<void> {
		const index = this.sessions.findIndex(s => s.id == sessionId);
		if (index >= 0) {
			const removedSession = this.sessions.splice(index, 1);
			this._onDidChangeSessions.fire({
				added: [],
				removed: removedSession,
				changed: [],
			});
		}
	}
}