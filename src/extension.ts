import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let baseOfModule = "from telethon import types\nfrom .. import loader, utils\n\n@loader.tds\nclass #CLASSNAME#Mod(loader.Module):\n\t'#DESCRIPTION#'\n\n\tstrings = {\n\t\t'name':'#MODULENAME#'\n\t}\n\t";
	let baseOfCommand = "\r\tasync def #COMMAND#cmd(self, m: types.Message):\n\t\t'#DESCRIPTION#'\n\t\treply = await m.get_reply_message()\n\t\targs = utils.get_args_raw(m)\n\t\tchat = m.chat.id or m.sender.id\n";
	let baseOfWatcher = "\r\tasync def watcher(self, m: types.Message):\n\t\t'Watcher'\n\t\tif not isinstance(m, types.Message):\n\t\t\treturn\n\t\treply = await m.get_reply_message()\n\t\targs = utils.get_args_raw(m)\n\t\tchat = m.chat.id or m.sender.id\n";
	let createModule = vscode.commands.registerCommand('ftgmoduleshelper.createModule', () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}
		vscode.window.showInputBox({ title: 'Enter name of module...', placeHolder: 'Type here...' }).then(x => {
			if (!x) {
				return;
			}
			vscode.window.activeTextEditor?.edit(edit => {
				edit.insert(new vscode.Position(0, 0),
					baseOfModule.replace('#CLASSNAME#', x)
						.replace('#MODULENAME#', x.replace('\'', '\\\''))
						.replace('#DESCRIPTION#', `Description for ${x.replace('\'', '\\\'')} module`)
				);
			});
		});
	});
	let createCommand = vscode.commands.registerCommand('ftgmoduleshelper.createCommand', () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}
		vscode.window.showInputBox({ title: 'Enter command...', placeHolder: 'Type here...' }).then(x => {
			if (!x) {
				return;
			}
			if (vscode.window.activeTextEditor!.selection.isEmpty) {
				vscode.window.activeTextEditor?.edit(edit => {
					edit.insert(new vscode.Position(vscode.window.activeTextEditor!.selection.active.line, 0),
						baseOfCommand.replace('#COMMAND#', x)
							.replace('#DESCRIPTION#', `Description for ${x.replace('\'', '\\\'')} command`)
					);
				});
			}
		});
	});
	let createWatcher = vscode.commands.registerCommand('ftgmoduleshelper.createWatcher', () => {
		if (!vscode.window.activeTextEditor) {
			return;
		}
		if (vscode.window.activeTextEditor!.selection.isEmpty) {
			vscode.window.activeTextEditor?.edit(edit => {
				edit.insert(new vscode.Position(vscode.window.activeTextEditor!.selection.active.line, 0),
					baseOfWatcher
				);
			});
		}
	});

	context.subscriptions.push(createModule, createCommand, createWatcher);
}

export function deactivate() { }
