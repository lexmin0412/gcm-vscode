import * as vscode from 'vscode';
import { execSync } from 'child_process';
import * as fs from 'fs'

let myStatusBarItem: vscode.StatusBarItem;
const EVENTS = {
	use: 'gcm-vscode.use'
};

// 初始化状态栏
const initStatusBar = async (context: vscode.ExtensionContext) => {
	const { subscriptions } = context;
	const currentEditorPath = vscode.window.activeTextEditor?.document.uri.path
	const workDir = currentEditorPath?.slice(0, currentEditorPath.lastIndexOf('/'))
	const userName = await execSync('git config user.name', {
		cwd: workDir
	}).toString().trim();
	const userEmail = await execSync('git config user.email', {
		cwd: workDir
	}).toString().trim();
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 300);
	myStatusBarItem.command = EVENTS.use;  // 点击时执行命令
	myStatusBarItem.text = `${userName}, ${userEmail}`;
	subscriptions.push(myStatusBarItem);
	myStatusBarItem.show();
};

// 注册事件
const registerCommand = (context: vscode.ExtensionContext) => {
	let disposable = vscode.commands.registerCommand(EVENTS.use, async () => {
		vscode.window.showInformationMessage('gcm use 执行成功!');
	});
	context.subscriptions.push(disposable);
};

// 扩展激活
export async function activate(context: vscode.ExtensionContext) {
	registerCommand(context);
	await initStatusBar(context);
}

// 扩展销毁
export function deactivate() {}
